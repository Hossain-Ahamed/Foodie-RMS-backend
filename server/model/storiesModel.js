const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
    },
    img: {
      type: String,
    },
    created_date: {
      type: Number,
    },
    remove_date: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("story", storySchema);
