const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
    },
    dish: {
      type: String,
    },
    ingredients: [
      {
        itemName: {
          type: String,
        },
        unit: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("recipe", recipeSchema);
