/**
 * Items Routes Module
 *
 * Handles CRUD operations for items.
 * Supports filtering, sorting, and pagination.
 */

const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

/**
 * POST /items
 * Create a new item
 */
router.post("/", async (req, res) => {
  try {
    const { name, rate, unit, isTaxable } = req.body;

    // Basic required field check
    if (!name || rate === undefined || !unit) {
      return res.status(400).json({
        message: "name, rate, and unit are required",
      });
    }

    const item = new Item({
      name,
      rate,
      unit,
      isTaxable: isTaxable !== undefined ? isTaxable : true,
    });

    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
});

/**
 * GET /items
 * Retrieve items with filtering, sorting, and pagination
 *
 * Query Parameters:
 *   - name: Partial match (case-insensitive)
 *   - sortBy: Field to sort by (default: createdAt)
 *   - order: asc | desc (default: desc)
 *   - page: Page number (default: 1)
 *   - limit: Number of records per page (default: 10)
 */
router.get("/", async (req, res) => {
  try {
    const { name, sortBy, order, page, limit } = req.query;

    // -----------------------
    // Build filter
    // -----------------------
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // -----------------------
    // Pagination
    // -----------------------
    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;

    if (currentPage < 1 || itemsPerPage <= 0) {
      return res.status(400).json({
        message: "page must be >= 1 and limit must be > 0",
      });
    }

    const skip = (currentPage - 1) * itemsPerPage;

    // -----------------------
    // Sorting
    // -----------------------
    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    // -----------------------
    // Database query
    // -----------------------
    const items = await Item.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(itemsPerPage);

    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
});

/**
 * GET /items/:id
 * Retrieve an item by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid item ID" });
  }
});

/**
 * PUT /items/:id
 * Update an item
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
});

/**
 * DELETE /items/:id
 * Delete an item
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid item ID" });
  }
});

module.exports = router;
