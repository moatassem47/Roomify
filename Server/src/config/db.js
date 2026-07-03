const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

// Force Node.js to use Google's public DNS servers for resolving MongoDB hostnames
// This fixes the querySrv ECONNREFUSED error caused by local loopback (127.0.0.1) DNS configurations.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("Could not set DNS servers programmatically:", err.message);
}

// Force Node.js to resolve IPv4 addresses first
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