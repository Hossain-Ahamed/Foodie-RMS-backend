const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
    },
    name: {
      type: String,
    },
    percentage: {
      type: Number,
    },
    minimumOrderAmount: {
      type: Number,
    },
    maximumDiscountLimit: {
      type: Number,
    },
    maximumNumberOfUse: {
      type: Number,
    },
    userCount: [
      {
        type: mongoose.ObjectId,
        ref: "users",
      }
    ],
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
