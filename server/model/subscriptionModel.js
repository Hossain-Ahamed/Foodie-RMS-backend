const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branches",
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
  deleteStatus: {
    type: String,
    default: false,
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
      payment_time: {
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
