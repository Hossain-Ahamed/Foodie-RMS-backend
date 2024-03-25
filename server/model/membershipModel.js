const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
  },
  singleTimeMinimumOrderAmount: {
    type: Number,
    default: 0,
  },
  MinimumOrderAmountTillNow: {
    type: Number,
    default: 0,
  },
  percentageOffer: {
    type: Number,
    default: 0,
  },
  MaximumLimit_in_TK: {
    type: Number,
    default: 0,
  },
  rules: {
    type: String,
    default: "Modification restricted to Super-admin only.",
  },
});

module.exports = mongoose.model("membership", membershipSchema);
