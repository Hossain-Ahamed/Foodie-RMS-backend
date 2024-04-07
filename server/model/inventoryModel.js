const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
    },
    itemName: {
      type: String,
    },
    vendorName: {
      type: String,
    },
    unit: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inventory", inventorySchema);
