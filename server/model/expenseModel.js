const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  billDate: {
    type: String,
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
        type: String,
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
