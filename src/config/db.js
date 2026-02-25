const mongoose = require("mongoose");

async function connectDb() {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/credit_limit_range_demo";

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log(`✅ Connected to MongoDB at ${uri}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to connect to MongoDB at ${uri}:`, err.message);
    throw err;
  }
}

module.exports = { connectDb };

