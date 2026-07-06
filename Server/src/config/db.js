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

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = connectDB;