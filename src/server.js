// Load environment variables from a .env file (e.g. MONGO_URL, PORT)
require("dotenv").config();

// Core framework and middleware imports
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Create the Express application
const app = express();
app.use(helmet());
// Parse incoming JSON requests and limit payload size to mitigate large body attacks
app.use(express.json({ limit: "10kb" }));

// Enable CORS for the frontend(s)
// In production (Render), this will automatically allow the requesting origin.
app.use(
  cors({
    origin: true, // Reflect request origin
    credentials: false,
  }),
);

// Basic rate limiter to prevent brute-force or excessive requests
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per minute
});
app.use(limiter);

// Mount routers for different resource groups. The route files define endpoints.
const customerRoutes = require("./routes/customers.routes");
app.use("/customers", customerRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const itemsRouter = require("./routes/items.routes");
app.use("/items", itemsRouter);

const invoicesRouter = require("./routes/invoices.routes");
app.use("/invoices", invoicesRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Invoice API is running",
    endpoints: {
      customers: "GET /customers",
      items: "GET /items",
      invoices: "POST /invoices",
    },
  });
});

// Connect to MongoDB using Mongoose. Connection string is read from `process.env.MONGODB_URI`.
const { connectDb } = require("./config/db");

// Start the HTTP server on the port defined in env or default to 3000
const PORT = process.env.PORT || 3000;

// Wait for database connection before starting server
(async () => {
  try {
    await connectDb();
    console.log("✅ MongoDB connection established");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 API Endpoints:`);
      console.log(`   - GET  /customers`);
      console.log(`   - GET  /items`);
      console.log(`   - POST /invoices`);
      console.log(`\n✅ Ready to accept requests!`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
