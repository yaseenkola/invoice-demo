/**
 * Seed Items Script
 * 
 * Populates the database with sample items for testing.
 */

require("dotenv").config();
const { connectDb } = require("../config/db");
const Item = require("../models/Item");

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

async function seedItems() {
  try {
    await connectDb();
    console.log("Connected to database");

    // Clear existing items
    await Item.deleteMany({});
    console.log("Cleared existing items");

    // Insert sample items
    const insertedItems = await Item.insertMany(sampleItems);
    console.log(`✅ Successfully seeded ${insertedItems.length} items`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding items:", error);
    process.exit(1);
  }
}

seedItems();
