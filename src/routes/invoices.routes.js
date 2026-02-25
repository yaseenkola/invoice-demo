const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Item = require("../models/Item");

// ==========================================
// POST /invoices – Create Invoice
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body;

    // 1️⃣ Validate customer
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain items" });
    }

    let invoiceItems = [];
    let subTotal = 0;
    let taxTotal = 0;

    // 2️⃣ Process each item
    for (let line of items) {
      const itemData = await Item.findById(line.item);

      if (!itemData) {
        return res.status(400).json({ message: "Item not found" });
      }

      const amount = line.quantity * itemData.rate;

      // Calculate tax (default to 18% if taxPercentage is not set)
      const taxPercentage = itemData.taxPercentage || 18;
      const tax = itemData.isTaxable
        ? (amount * taxPercentage) / 100
        : 0;

      invoiceItems.push({
        item: itemData._id,
        quantity: line.quantity,
        rate: itemData.rate,
        amount,
      });

      subTotal += amount;
      taxTotal += tax;
    }

    const grandTotal = subTotal + taxTotal;

    const invoice = new Invoice({
      customer,
      items: invoiceItems,
      subTotal,
      taxTotal,
      grandTotal,
    });

    const savedInvoice = await invoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
      data: savedInvoice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice" });
  }
});

// ==========================================
// GET /invoices – Get All Invoices
// ==========================================
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "customerName email phone")
      .populate("items.item", "name rate isTaxable")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

// ==========================================
// GET /invoices/:id – Get Invoice By ID
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer", "customerName email phone")
      .populate("items.item", "name rate isTaxable");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: "Invalid invoice ID" });
  }
});


module.exports = router;