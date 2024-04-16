const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branches",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    deleteStatus: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);
