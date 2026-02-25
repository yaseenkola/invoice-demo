/**
 * Seed All Script
 * 
 * Populates the database with sample customers and items for testing.
 * Run this script to set up the database with all necessary data.
 */

require("dotenv").config();
const { connectDb } = require("../config/db");
const Customer = require("../models/Customer");
const Item = require("../models/Item");

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

const sampleItems = [
  { name: "USB Keyboard", rate: 750, unit: "pcs", isTaxable: true },
  { name: "USB Mouse", rate: 350, unit: "pcs", isTaxable: true },
  { name: "USB Cable", rate: 150, unit: "pcs", isTaxable: true },
  { name: "USB Flash Drive 16GB", rate: 450, unit: "pcs", isTaxable: true },
  { name: "USB Flash Drive 32GB", rate: 650, unit: "pcs", isTaxable: true },
  { name: "USB Hub", rate: 850, unit: "pcs", isTaxable: true },
  { name: "Wireless Mouse", rate: 550, unit: "pcs", isTaxable: true },
  { name: "Wireless Keyboard", rate: 1200, unit: "pcs", isTaxable: true },
  { name: "HDMI Cable", rate: 300, unit: "pcs", isTaxable: true },
  { name: "Ethernet Cable", rate: 200, unit: "pcs", isTaxable: true },
  { name: "Laptop Stand", rate: 1500, unit: "pcs", isTaxable: true },
  { name: "Monitor Stand", rate: 2000, unit: "pcs", isTaxable: true },
  { name: "Webcam", rate: 2500, unit: "pcs", isTaxable: true },
  { name: "Microphone", rate: 1800, unit: "pcs", isTaxable: true },
  { name: "Headphones", rate: 2200, unit: "pcs", isTaxable: true },
  { name: "USB-C Adapter", rate: 800, unit: "pcs", isTaxable: true },
  { name: "Power Bank", rate: 1500, unit: "pcs", isTaxable: true },
  { name: "Phone Charger", rate: 400, unit: "pcs", isTaxable: true },
  { name: "Laptop Charger", rate: 2500, unit: "pcs", isTaxable: true },
  { name: "USB Extension Cable", rate: 250, unit: "pcs", isTaxable: true },
  { name: "USB 3.0 Cable", rate: 350, unit: "pcs", isTaxable: true },
  { name: "USB-C Cable", rate: 500, unit: "pcs", isTaxable: true },
  { name: "USB OTG Cable", rate: 200, unit: "pcs", isTaxable: true },
  { name: "USB Sound Card", rate: 600, unit: "pcs", isTaxable: true },
  { name: "USB WiFi Adapter", rate: 900, unit: "pcs", isTaxable: true },
];

async function seedAll() {
  try {
    await connectDb();
    console.log("✅ Connected to database\n");

    // Clear existing data
    console.log("Clearing existing data...");
    await Customer.deleteMany({});
    await Item.deleteMany({});
    console.log("✅ Cleared existing data\n");

    // Insert sample customers
    console.log("Seeding customers...");
    const insertedCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`✅ Successfully seeded ${insertedCustomers.length} customers\n`);

    // Insert sample items
    console.log("Seeding items...");
    const insertedItems = await Item.insertMany(sampleItems);
    console.log(`✅ Successfully seeded ${insertedItems.length} items\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`\nSummary:`);
    console.log(`  - Customers: ${insertedCustomers.length}`);
    console.log(`  - Items: ${insertedItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedAll();
