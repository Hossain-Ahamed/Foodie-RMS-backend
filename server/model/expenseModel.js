const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branches",
  },
  category: {
    type: String,
  },
  billDate: {
    type: String,
  },
  expense: {
    type: Number,
  },
  totalPayment: {
    type: Number,
  },
  payTo: {
    type: String,
  },
  payeeID: {
    type: String,
  },
  vendorDescription: {
    type: String,
  },
  deleteStatus: {
    type: String,
    default: false,
  },
  transactions: [
    {
      paymentDate: {
        type: String,
      },
      paymentAmount: {
        type: String,
      },
      reference: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
});
module.exports = mongoose.model("Expense", expenseSchema);
