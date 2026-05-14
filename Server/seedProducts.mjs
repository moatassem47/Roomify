import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH  = path.join(__dirname, ".env");
const JSON_PATH = path.join(__dirname, "../furniture_data_clean_sorted.json");

dotenv.config({ path: ENV_PATH });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not defined in .env");
  process.exit(1);
}

// ── Schema (mirrors productSchema.js exactly) ────────────────
const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true, min: 20 },
    stockQuantity: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Living Room", "Bedroom", "Office", "Hallway", "Kitchen"],
    },
    imageUrls: { type: [String], validate: (v) => v.length > 0 },
    rating:    { type: Number, min: 0, max: 5, default: 0 },
    reviews:   { type: Number, min: 0, default: 0 },
    model3dUrl: { type: String, default: "" },
    hasdim:     { type: Boolean, default: true },
    has3d: {
      type: Boolean,
      default: function () { return !!this.model3dUrl; },
    },
    specs: {
      width:          String,
      depth:          String,
      height:         String,
      material:       [String],
      color:          [String],
      weightCapacity: String,
      upholstery:     String,
      weight:         String,
      assembly:       String,
      origin:         String,
      certified:      String,
      recyclable:     String,
      carbonOffset:   String,
      warranty:       String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// ── Seed ─────────────────────────────────────────────────────
async function seed() {
  console.log("🔌  Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);

  const raw = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

  const { deletedCount } = await Product.deleteMany({});
  console.log(`🗑️   Deleted ${deletedCount} existing product(s).`);

  const inserted = await Product.insertMany(raw, { ordered: false });
  console.log(`✅  Inserted ${inserted.length} products successfully.`);

  await mongoose.disconnect();
  console.log("🔌  Disconnected.");
}

seed().catch((err) => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
