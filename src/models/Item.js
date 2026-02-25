const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    rate: { type: Number, required: true, min: 0, index: true },
    unit: { type: String, required: true, trim: true },
    isTaxable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
