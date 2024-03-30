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
    videoFile: {
      type: String,
    },
    likeCount: {
      type: Number,
    },
    dislikeCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("story", storySchema);
