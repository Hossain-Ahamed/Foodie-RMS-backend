const mongoose = require("mongoose");

const expenseSchema = new mongoose.schema({
  category: {
    type: String,
    required: true,
  },
  billDate: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  payTo: {
    type: String,
    required: true,
  },
  payeeID: {
    type: String,
    required: true,
  },
  vendorDescription: {
    type: String,
    required: true,
  },
  transactions: [
    {
      paymentDate: {
        type: Number,
        required: true,
      },
      paymentAmount: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("Expense", expenseSchema);
