const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
  },
  user: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
