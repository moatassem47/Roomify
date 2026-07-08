const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("Could not set DNS servers programmatically:", err.message);
}


dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const getDatabaseName = (url) => {
  if (process.env.MONGO_DB_NAME) {
    return process.env.MONGO_DB_NAME;
  }

  try {
    const parsedUrl = new URL(url);
    const uriDatabase = parsedUrl.pathname.replace(/^\/+/, "");
    return uriDatabase || "Roomify";
  } catch (e) {
    return "Roomify";
  }
};

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) {
      throw new Error("MONGO_URI is not set");
    }

    const dbName = getDatabaseName(url);
    await mongoose.connect(url, { dbName });
    console.log(`Database connected: ${mongoose.connection.db.databaseName}`);
  } catch (e) {
    console.error(`Database connection failed: ${e.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
