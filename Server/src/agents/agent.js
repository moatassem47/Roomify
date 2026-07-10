
const {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai"); 
const { HumanMessage } = require("@langchain/core/messages"); 
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts"); 
const { StateGraph, Annotation } = require("@langchain/langgraph"); 
const { tool } = require("@langchain/core/tools"); 
const { ToolNode } = require("@langchain/langgraph/prebuilt"); 
const { MongoDBSaver } = require("@langchain/langgraph-checkpoint-mongodb"); 
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb"); 
const mongoose = require("mongoose"); 
const { z } = require("zod"); 
require("dotenv/config"); 


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


function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}


async function retryWithBackoff(fn, maxRetries = 3) {
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(); 
    } catch (error) {
     
      if (error.status === 429 && attempt < maxRetries) {
        
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error; 
    }
  }
  throw new Error("Max retries exceeded"); 
}


async function callAgent(query, thread_id) {
  try {
    
    const dbName = "Roomify";
    const db = mongoose.connection.useDb(dbName).db;
    const collection = db.collection("product_vectors"); 

   
    const GraphState = Annotation.Root({
      messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [], 
      }),
    });

    
    const itemLookupTool = tool(
      
      async ({ query, n = 4 }) => {
        try {
          console.log("Item lookup tool called with query:", query);

          
          const totalCount = await collection.countDocuments();
          console.log(`Total documents in collection: ${totalCount}`);

          
          if (totalCount === 0) {
            console.log("Collection is empty");
            return JSON.stringify({
              error: "No items found in inventory",
              message: "The inventory database appears to be empty",
              count: 0,
            });
          }

         
          

          
          const dbConfig = {
            collection: collection, 
            indexName: "vector-index",
            textKey: "text",
            embeddingKey: "embedding", 
          };

          
          const vectorStore = new MongoDBAtlasVectorSearch(
            new TruncatedEmbeddings({
              apiKey: process.env.GOOGLE_API_KEY, 
              model: "gemini-embedding-001", 
            }),
            dbConfig,
          );

          console.log("Performing vector search...");
          
          const result = await vectorStore.similaritySearchWithScore(query, n);
          console.log(`Vector search returned ${result.length} results`);

          
          if (result.length === 0) {
            console.log(
              "Vector search returned no results, trying text search...",
            );
           
            const escapedQuery = escapeRegex(query);
            
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
              .toArray(); 

            console.log(`Text search returned ${textResults.length} results`);
           
            return JSON.stringify({
              results: textResults,
              searchType: "text", 
              query: query,
              count: textResults.length,
            });
          }

          
          return JSON.stringify({
            results: result,
            searchType: "vector", 
            query: query,
            count: result.length,
          });
        } catch (error) {
          
          console.error("Error in item lookup:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });

          
          return JSON.stringify({
            error: "Failed to search inventory",
            details: error.message,
            query: query,
          });
        }
      },
      
      {
        name: "item_lookup", 
        description:
          "Searches Roomify furniture products using semantic vector search.", 
        schema: z.object({
          
          query: z.string().describe("The search query"), 
          n: z
            .number()
            .optional()
            .default(10) 
            .describe("Number of results to return"),
        }),
      },
    );

   
    const tools = [itemLookupTool];
    
    const toolNode = new ToolNode(tools);

    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-3.1-flash-lite", 
      temperature: 0, 
      maxRetries: 0, 
      apiKey: process.env.GOOGLE_API_KEY, 
    }).bindTools(tools); 

    
    function shouldContinue(state) {
      const messages = state.messages; 
      const lastMessage = messages[messages.length - 1]; 

      
      if (lastMessage.tool_calls?.length) {
        return "tools"; 
      }
      return "__end__"; 
    }

    
    async function callModel(state) {
    
      return retryWithBackoff(async () => {
        
        
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system", 
            `You are Roomify AI, a helpful furniture shopping assistant.

          Your job is to help customers find furniture, answer questions about products, prices, categories, materials, colors, dimensions, ratings and stock.

          Always use the item_lookup tool whenever the user asks about any product or furniture.

          Do not make up products that are not returned by the tool.

          If no matching products are found, politely tell the customer that nothing matched and suggest similar categories.

          Keep responses short, friendly and professional.

          Current time: {time}`,
          ],
          new MessagesPlaceholder("messages"), 
        ]);

        
        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(), 
          messages: state.messages, 
        });

 

        
        const result = await model.invoke(formattedPrompt);
        
        return { messages: [result] };
      });
    }

    
    const workflow = new StateGraph(GraphState)
      .addNode("agent", callModel) // Add AI model node
      .addNode("tools", toolNode) // Add tool execution node
      .addEdge("__start__", "agent") // Start workflow at agent
      .addConditionalEdges("agent", shouldContinue) // Agent decides: tools or end
      .addEdge("tools", "agent"); // After tools, go back to agent

    
    const checkpointer = new MongoDBSaver({
      client: mongoose.connection.getClient(),
      dbName,
    });
    
    const app = workflow.compile({ checkpointer });

    
   const finalState = await app.invoke(
  { 
    messages: [new HumanMessage({ content: query })] 
  },
  {
    recursionLimit: 15,
    configurable: { thread_id: String(thread_id) } 
  }
);

    
    const response =
      finalState.messages[finalState.messages.length - 1].content;
    console.log("Agent response:", response);

    return response; 
  } catch (error) {
    
    console.error("Error in callAgent:", error.message);

    if (error.status === 429) {
     
      throw new Error(
        "Service temporarily unavailable due to rate limits. Please try again in a minute.",
      );
    } else if (error.status === 401) {
      
      throw new Error(
        "Authentication failed. Please check your API configuration.",
      );
    } else {
     
      throw new Error(`Agent failed: ${error.message}`);
    }
  }
}

module.exports = { callAgent };
