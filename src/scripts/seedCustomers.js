/**
 * Seed Customers Script
 * 
 * Populates the database with sample customers for testing.
 */

require("dotenv").config();
const { connectDb } = require("../config/db");
const Customer = require("../models/Customer");

const sampleCustomers = [
  {
    customerNumber: 1,
    customerName: "Alpha Stores",
    email: "alpha@example.com",
    phone: "111-111-1111",
    creditLimit: 8000,
  },
  {
    customerNumber: 2,
    customerName: "Beta Trading",
    email: "beta@example.com",
    phone: "222-222-2222",
    creditLimit: 12000,
  },
  {
    customerNumber: 3,
    customerName: "Gamma Retail",
    email: "gamma@example.com",
    phone: "333-333-3333",
    creditLimit: 25000,
  },
  {
    customerNumber: 4,
    customerName: "Delta Mart",
    email: "delta@example.com",
    phone: "444-444-4444",
    creditLimit: 50000,
  },
  {
    customerNumber: 5,
    customerName: "Epsilon Supplies",
    email: "epsilon@example.com",
    phone: "555-555-5555",
    creditLimit: 100000,
  },
  {
    customerNumber: 6,
    customerName: "Zeta Wholesale",
    email: "zeta@example.com",
    phone: "666-666-6666",
    creditLimit: 250000,
  },
  {
    customerNumber: 7,
    customerName: "Tech Solutions Inc",
    email: "tech@example.com",
    phone: "777-777-7777",
    creditLimit: 150000,
  },
  {
    customerNumber: 8,
    customerName: "Global Electronics",
    email: "global@example.com",
    phone: "888-888-8888",
    creditLimit: 300000,
  },
];

async function seedCustomers() {
  try {
    await connectDb();
    console.log("Connected to database");

    // Clear existing customers
    await Customer.deleteMany({});
    console.log("Cleared existing customers");

    // Insert sample customers
    const insertedCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`✅ Successfully seeded ${insertedCustomers.length} customers`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding customers:", error);
    process.exit(1);
  }
}

seedCustomers();

