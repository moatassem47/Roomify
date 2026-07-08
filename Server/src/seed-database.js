const { Document } = require("@langchain/core/documents");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./model/productSchema");
const ProductVector = require("./model/productVectorSchema");

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

const embeddings = new TruncatedEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

const createVectorSearchIndex = async () => {
  try {
    await ProductVector.createSearchIndex({
      name: "vector-index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 768,
            similarity: "cosine",
          },
        ],
      },
    });

    console.log("✅ Vector Search Index created");
  } catch (err) {
    if (err.codeName === "IndexAlreadyExists") {
      console.log("ℹ️ Vector Search Index already exists");
    } else {
      throw err;
    }
  }
};

const createItemSummary = (product) => {
  return `
Product: ${product.name}

Description:
${product.description}

Category: ${product.category}
Price: $${product.price}
Rating: ${product.rating}/5 (${product.reviews} reviews)
Stock: ${product.stockQuantity}

Dimensions:
- Width: ${product.specs.width}
- Depth: ${product.specs.depth}
- Height: ${product.specs.height}

Materials: ${product.specs.material.join(", ")}
Colors: ${product.specs.color.join(", ")}

Tags:
${product.category}
${product.specs.material.join(", ")}
${product.specs.color.join(", ")}

Features:
- Weight Capacity: ${product.specs.weightCapacity}
- Upholstery: ${product.specs.upholstery}
- Weight: ${product.specs.weight}
- Assembly: ${product.specs.assembly}
- Origin: ${product.specs.origin}
- Certified: ${product.specs.certified}
- Recyclable: ${product.specs.recyclable}
- Warranty: ${product.specs.warranty}

Supports 3D: ${product.has3d ? "Yes" : "No"}
Supports Dimensions: ${product.hasdim ? "Yes" : "No"}
`;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
    await ProductVector.createCollection();
    await createVectorSearchIndex();

  

const collection = mongoose.connection.db.collection("product_vectors");

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection,
  indexName: "vector-index",
  textKey: "text",
  embeddingKey: "embedding",
});
    const products = await Product.find();

    console.log(`📦 Found ${products.length} products`);

    const docs = products.map(
      (product) =>
        new Document({
          pageContent: createItemSummary(product),
          metadata: {
            productId: product._id.toString(),
            name: product.name,
            category: product.category,
            price: product.price,
            rating: product.rating,
          },
        })
    );

    await ProductVector.deleteMany({});
 
    await vectorStore.addDocuments(docs);

    console.log(`✅ Successfully embedded ${docs.length} products`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed database");
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();