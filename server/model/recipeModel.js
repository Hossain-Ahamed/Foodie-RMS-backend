const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branches",
    },
    dish: {
      type: String,
    },
    dishId: {
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
        unitType: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("recipe", recipeSchema);
