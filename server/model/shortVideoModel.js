const mongoose = require("mongoose");

const shortVideoSchema = new mongoose.Schema(
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

module.exports = mongoose.model("shortVideo", shortVideoSchema);
