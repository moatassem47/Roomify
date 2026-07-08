const {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");

const { HumanMessage } = require("@langchain/core/messages");
const { MessagesPlaceholder, ChatPromptTemplate } = require("@langchain/core/prompts");
const { tool } = require("@langchain/core/tools");
const { StateGraph, Annotation } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { MongoDBSaver } = require("@langchain/langgraph-checkpoint-mongodb");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { z } = require("zod");

const DEFAULT_CHECKPOINT_TTL_SECONDS = 60 * 60 
const initializedCheckpointClients = new WeakSet();

const getCheckpointTtlSeconds = () => {
  const ttl = Number(process.env.CHAT_CHECKPOINT_TTL_SECONDS);
  return Number.isFinite(ttl) && ttl > 0
    ? ttl
    : DEFAULT_CHECKPOINT_TTL_SECONDS;
};

const setupCheckpointer = async (checkpointer, client) => {
  if (initializedCheckpointClients.has(client)) return;

  const errors = await checkpointer.setup();
  if (errors?.length) {
    throw errors[0];
  }

  initializedCheckpointClients.add(client);
};

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

const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
};

const callAgent = async (client, query, thread_id) => {
  try {
    const db = client.db("Roomify");
    const collection = db.collection("product_vectors");

    // 🔥 LIMIT HISTORY SIZE (important fix)
    const GraphState = Annotation.Root({
      messages: Annotation({
        reducer: (x, y) => {
          const merged = x.concat(y);
          return merged.slice(-12); // keep last 12 messages only
        },
      }),
    });

    // =========================
    // TOOL
    // =========================
    const itemLookupTool = tool(
      async ({ query, n = 4 }) => {
        try {
          console.log("Tool query:", query);

          const totalCount = await collection.countDocuments();
          if (totalCount === 0) {
            return JSON.stringify({
              error: "Empty inventory",
              count: 0,
            });
          }

          const vectorStore = new MongoDBAtlasVectorSearch(
            new TruncatedEmbeddings({
              apiKey: process.env.GOOGLE_API_KEY,
              model: "gemini-embedding-001",
            }),
            {
              collection,
              indexName: "vector-index",
              textKey: "text",
              embeddingKey: "embedding",
            }
          );

          const result = await vectorStore.similaritySearchWithScore(query, n);

          // 🔥 REDUCE OUTPUT SIZE (IMPORTANT FIX)
          const cleaned = result.slice(0, 3).map((r) => ({
            pageContent: r[0]?.pageContent?.slice(0, 200),
            score: r[1],
          }));

          if (!result.length) {
            const textResults = await collection
              .find({
                $or: [
                  { name: { $regex: query, $options: "i" } },
                  { category: { $regex: query, $options: "i" } },
                  { text: { $regex: query, $options: "i" } },
                ],
              })
              .limit(3)
              .toArray();

            return JSON.stringify({
              results: textResults.slice(0, 3),
              type: "text",
            });
          }

          return JSON.stringify({
            results: cleaned,
            type: "vector",
          });
        } catch (err) {
          return JSON.stringify({
            error: err.message,
          });
        }
      },
      {
        name: "item_lookup",
        description: "Search furniture items",
        schema: z.object({
          query: z.string(),
          n: z.number().optional().default(3),
        }),
      }
    );

    const tools = [itemLookupTool];
    const toolNode = new ToolNode(tools);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0,
      maxRetries: 1,
      apiKey: process.env.GOOGLE_API_KEY,
    }).bindTools(tools);

    // =========================
    // ROUTING
    // =========================
    function shouldContinue(state) {
      const last = state.messages[state.messages.length - 1];
      return last.tool_calls?.length ? "tools" : "__end__";
    }

    // =========================
    // AGENT NODE
    // =========================
    async function callModel(state) {
      return retryWithBackoff(async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system",
            `You are a furniture store assistant.

Always use item_lookup when needed.

If no results, suggest alternatives.

Time: {time}`,
          ],
          new MessagesPlaceholder("messages"),
        ]);

        const formatted = await prompt.formatMessages({
          time: new Date().toISOString(),
          messages: state.messages,
        });

        const res = await model.invoke(formatted);
        return { messages: [res] };
      });
    }

    // =========================
    // GRAPH
    // =========================
    const workflow = new StateGraph(GraphState)
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge("__start__", "agent")
      .addConditionalEdges("agent", shouldContinue)
      .addEdge("tools", "agent");

    // =========================
    // CHECKPOINTER (OPTIMIZED)
    // =========================
    const checkpointer = new MongoDBSaver({
      client,
      dbName: "Roomify",
      ttl: getCheckpointTtlSeconds(),
    });
    await setupCheckpointer(checkpointer, client);

    const app = workflow.compile({ checkpointer });

    const result = await app.invoke(
      {
        messages: [new HumanMessage(query)],
      },
      {
        recursionLimit: 6, // 🔥 reduced from 15
        configurable: { thread_id },
      }
    );

    const response =
      result.messages[result.messages.length - 1].content;

    return response;
  } catch (error) {
    console.error("Agent error:", error);

    if (error.status === 429) {
      throw new Error("Rate limited, try again later");
    }

    throw new Error(error.message);
  }
};

module.exports = { callAgent };
