const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  rate: Number, //snapshot
  amount: Number
});

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    items: [invoiceItemSchema],
    subTotal: Number,
    taxTotal: Number,
    grandTotal: Number,
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);