const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
  },
  packageType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Number,
  },
  endDate: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
  previousSubscriptions: [
    {
      packageType: {
        type: String,
      },
      startDate: {
        type: Number,
      },
      endDate: {
        type: Number,
      },
      price: {
        type: Number,
      },
      paymentStatus: {
        type: Boolean,
        default: false,
      },
      transactionID: {
        type: String,
      },
    },
  ],
});
module.exports = mongoose.model("Subscription", subscriptionSchema);
