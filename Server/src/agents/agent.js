// Import required modules from LangChain ecosystem
const {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai"); // For creating vector embeddings from text using Gemini
const { HumanMessage } = require("@langchain/core/messages"); // Message types for conversations
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts"); // Structured prompts and placeholders
const { StateGraph, Annotation } = require("@langchain/langgraph"); // State-based workflow orchestration
const { tool } = require("@langchain/core/tools"); // For creating custom tools/functions
const { ToolNode } = require("@langchain/langgraph/prebuilt"); // Pre-built node for executing tools
const { MongoDBSaver } = require("@langchain/langgraph-checkpoint-mongodb"); // For saving conversation state
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb"); // Vector search integration with MongoDB
const mongoose = require("mongoose"); // Mongoose for database connectivity
const { z } = require("zod"); // Schema validation library
require("dotenv/config"); // Load environment variables from .env file

// Class to truncate Google embeddings to 768 dimensions
class TruncatedEmbeddings extends GoogleGenerativeAIEmbeddings {
  async embedDocuments(documents) {
    const res = await super.embedDocuments(documents);
    return res.map(v => v.slice(0, 768));
  }
  async embedQuery(document) {
    const res = await super.embedQuery(document);
    return res.slice(0, 768);
  }
}

// Helper to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Utility function to handle API rate limits with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  // Loop through retry attempts
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(); // Try to execute the function
    } catch (error) {
      // Check if it's a rate limit error (HTTP 429) and we have retries left
      if (error.status === 429 && attempt < maxRetries) {
        // Calculate exponential backoff delay: 2^attempt seconds, max 30 seconds
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        // Wait for the calculated delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue; // Go to next iteration (retry)
      }
      throw error; // If not rate limit or out of retries, throw the error
    }
  }
  throw new Error("Max retries exceeded"); // This should never be reached
}

// Main function that creates and runs the AI agent
async function callAgent(query, thread_id) {
  try {
    // Database configuration using Mongoose connections
    const dbName = "Roomify";
    const db = mongoose.connection.useDb(dbName).db;
    const collection = db.collection("product_vectors"); // Get the 'items' collection

    // Define the state structure for the agent workflow
    const GraphState = Annotation.Root({
      messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [], //  Ensures the array is never undefined or empty
      }),
    });

    // Create a custom tool for searching furniture inventory
    const itemLookupTool = tool(
      // The actual function that will be executed when tool is called
      async ({ query, n = 4 }) => {
        try {
          console.log("Item lookup tool called with query:", query);

          // Check if database has any data at all
          const totalCount = await collection.countDocuments();
          console.log(`Total documents in collection: ${totalCount}`);

          // Early return if database is empty
          if (totalCount === 0) {
            console.log("Collection is empty");
            return JSON.stringify({
              error: "No items found in inventory",
              message: "The inventory database appears to be empty",
              count: 0,
            });
          }

          // Get sample documents for debugging purposes
          const sampleDocs = await collection.find({}).limit(3).toArray();
          console.log("Sample documents:", sampleDocs);

          // Configuration for MongoDB Atlas Vector Search
          const dbConfig = {
            collection: collection, // MongoDB collection to search
            indexName: "vector-index",
            textKey: "text",
            embeddingKey: "embedding", // Field containing the vector embeddings
          };

          // Create vector store instance for semantic search using Google Gemini embeddings
          const vectorStore = new MongoDBAtlasVectorSearch(
            new TruncatedEmbeddings({
              apiKey: process.env.GOOGLE_API_KEY, // Google API key from environment
              model: "gemini-embedding-001", // Gemini embedding model
            }),
            dbConfig,
          );

          console.log("Performing vector search...");
          // Perform semantic search using vector embeddings
          const result = await vectorStore.similaritySearchWithScore(query, n);
          console.log(`Vector search returned ${result.length} results`);

          // If vector search returns no results, fall back to text search
          if (result.length === 0) {
            console.log(
              "Vector search returned no results, trying text search...",
            );
            // Escape special regex characters in the query for safe search
            const escapedQuery = escapeRegex(query);
            // MongoDB text search using regular expressions, excluding the large embedding array
            const textResults = await collection
              .find(
                {
                  $or: [
                    { name: { $regex: escapedQuery, $options: "i" } },
                    { category: { $regex: escapedQuery, $options: "i" } },
                    { text: { $regex: escapedQuery, $options: "i" } },
                  ],
                },
                { projection: { embedding: 0 } }
              )
              .limit(n)
              .toArray(); // Limit results and convert to array

            console.log(`Text search returned ${textResults.length} results`);
            // Return text search results as JSON string
            return JSON.stringify({
              results: textResults,
              searchType: "text", // Indicate this was a text search
              query: query,
              count: textResults.length,
            });
          }

          // Return vector search results as JSON string
          return JSON.stringify({
            results: result,
            searchType: "vector", // Indicate this was a vector search
            query: query,
            count: result.length,
          });
        } catch (error) {
          // Log detailed error information for debugging
          console.error("Error in item lookup:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });

          // Return error information as JSON string
          return JSON.stringify({
            error: "Failed to search inventory",
            details: error.message,
            query: query,
          });
        }
      },
      // Tool metadata and schema definition
      {
        name: "item_lookup", // Tool name that the AI will reference
        description:
          "Searches Roomify furniture products using semantic vector search.", // Description for the AI
        schema: z.object({
          // Input validation schema
          query: z.string().describe("The search query"), // Required string parameter
          n: z
            .number()
            .optional()
            .default(10) // Optional number parameter with default
            .describe("Number of results to return"),
        }),
      },
    );

    // Array of all available tools (just one in this case)
    const tools = [itemLookupTool];
    // Create a tool execution node for the workflow
    const toolNode = new ToolNode(tools);

    // Initialize the AI model (Google's Gemini)
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-3.1-flash-lite", // Use Gemini 1.5 Flash model
      temperature: 0, // Deterministic responses (no randomness)
      maxRetries: 0, // Disable built-in retries (we handle our own)
      apiKey: process.env.GOOGLE_API_KEY, // Google API key from environment
    }).bindTools(tools); // Bind our custom tools to the model

    // Decision function: determines next step in the workflow
    function shouldContinue(state) {
      const messages = state.messages; // Get all messages
      const lastMessage = messages[messages.length - 1]; // Get the most recent message

      // If the AI wants to use tools, go to tools node; otherwise end
      if (lastMessage.tool_calls?.length) {
        return "tools"; // Route to tool execution
      }
      return "__end__"; // End the workflow
    }

    // Function that calls the AI model with retry logic
    async function callModel(state) {
    
      return retryWithBackoff(async () => {
        // Wrap in retry logic
        // Create a structured prompt template
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system", // System message defines the AI's role and behavior
            `You are Roomify AI, a helpful furniture shopping assistant.

          Your job is to help customers find furniture, answer questions about products, prices, categories, materials, colors, dimensions, ratings and stock.

          Always use the item_lookup tool whenever the user asks about any product or furniture.

          Do not make up products that are not returned by the tool.

          If no matching products are found, politely tell the customer that nothing matched and suggest similar categories.

          Keep responses short, friendly and professional.

          Current time: {time}`,
          ],
          new MessagesPlaceholder("messages"), // Placeholder for conversation history
        ]);

        // Fill in the prompt template with actual values
        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(), // Current timestamp
          messages: state.messages, // All previous messages
        });

 

        // Call the AI model with the formatted prompt
        const result = await model.invoke(formattedPrompt);
        // Return new state with the AI's response added
        return { messages: [result] };
      });
    }

    // Build the workflow graph
    const workflow = new StateGraph(GraphState)
      .addNode("agent", callModel) // Add AI model node
      .addNode("tools", toolNode) // Add tool execution node
      .addEdge("__start__", "agent") // Start workflow at agent
      .addConditionalEdges("agent", shouldContinue) // Agent decides: tools or end
      .addEdge("tools", "agent"); // After tools, go back to agent

    // Initialize conversation state persistence using Mongoose's internal client connection
    const checkpointer = new MongoDBSaver({
      client: mongoose.connection.getClient(),
      dbName,
    });
    // Compile the workflow with state saving
    const app = workflow.compile({ checkpointer });

    // Execute the workflow
   const finalState = await app.invoke(
  { 
    messages: [new HumanMessage({ content: query })] 
  },
  {
    recursionLimit: 15,
    configurable: { thread_id: String(thread_id) } // Ensure thread_id is strictly a string
  }
);

    // Extract the final response from the conversation
    const response =
      finalState.messages[finalState.messages.length - 1].content;
    console.log("Agent response:", response);

    return response; // Return the AI's final response
  } catch (error) {
    // Handle different types of errors with user-friendly messages
    console.error("Error in callAgent:", error.message);

    if (error.status === 429) {
      // Rate limit error
      throw new Error(
        "Service temporarily unavailable due to rate limits. Please try again in a minute.",
      );
    } else if (error.status === 401) {
      // Authentication error
      throw new Error(
        "Authentication failed. Please check your API configuration.",
      );
    } else {
      // Generic error
      throw new Error(`Agent failed: ${error.message}`);
    }
  }
}

module.exports = { callAgent };
