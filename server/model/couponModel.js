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
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    minimumOrderAmount: {
      type: Number,
      required: true,
    },
    maximumDiscountLimit: {
      type: Number,
      required: true,
    },
    maximumNumberOfUse: {
      type: Number,
      required: true,
    },
    userCount: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
