/**
 * Customer Routes Module
 *
 * Handles CRUD operations for customers.
 * Supports filtering, sorting, and pagination.
 */

const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

/**
 * POST /customers
 * Create a new customer
 */
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      customerNumber,
      age,
      dateOfBirth,
      creditLimit,
      gstNumber,
    } = req.body;

    // Basic required field check
    if (!customerName || !email || !customerNumber) {
      return res.status(400).json({
        message: "customerName, email, and customerNumber are required",
      });
    }

    const customer = new Customer({
      customerName,
      email,
      customerNumber,
      age,
      dateOfBirth,
      creditLimit,
      gstNumber,
    });

    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
});

/**
 * GET /customers
 * Retrieve customers with filtering, sorting, and pagination
 *
 * Query Parameters:
 *   - customerName: Partial match (case-insensitive)
 *   - email: Partial match (case-insensitive)
 *   - customerNumber: Exact match
 *   - minCredit: Minimum creditLimit
 *   - maxCredit: Maximum creditLimit
 *   - sort: Field to sort by (default: createdAt)
 *   - order: asc | desc (default: desc)
 *   - skip: Number of records to skip (default: 0)
 *   - limit: Number of records to return (default: 10)
 */
router.get("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      customerNumber,
      minCredit,
      maxCredit,
      sort,
      order,
      skip,
      limit,
    } = req.query;

    // -----------------------
    // Build filter
    // -----------------------
    const filter = {};

    if (customerName) {
      filter.customerName = { $regex: customerName, $options: "i" };
    }

    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    if (customerNumber) {
      filter.customerNumber = customerNumber;
    }

    if (minCredit || maxCredit) {
      filter.creditLimit = {};
      if (minCredit) filter.creditLimit.$gte = Number(minCredit);
      if (maxCredit) filter.creditLimit.$lte = Number(maxCredit);
    }

    // -----------------------
    // Pagination
    // -----------------------
    const parsedSkip = Number(skip) || 0;
    const parsedLimit = Number(limit) || 10;

    if (parsedSkip < 0 || parsedLimit <= 0) {
      return res.status(400).json({
        message: "skip must be >= 0 and limit must be > 0",
      });
    }

    // -----------------------
    // Sorting
    // -----------------------
    const sortField = sort || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    // -----------------------
    // Database query
    // -----------------------
    const customers = await Customer.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(parsedSkip)
      .limit(parsedLimit);

    const totalCustomers = await Customer.countDocuments(filter);

    res.status(200).json({
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      skip: parsedSkip,
      limit: parsedLimit,
      totalCustomers,
      returnedCustomers: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
});

/**
 * GET /customers/:id
 * Retrieve a customer by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: "Invalid customer ID" });
  }
});

/**
 * PUT /customers/:id
 * Update a customer
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update customer",
      error: error.message,
    });
  }
});

/**
 * DELETE /customers/:id
 * Delete a customer
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid customer ID" });
  }
});

module.exports = router;
