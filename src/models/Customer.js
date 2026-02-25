const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerNumber: { type: Number, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    creditLimit: { type: Number, required: true, min: 0, index: true },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

