const mongoose = require("mongoose");

const dishesSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    supplementary_duty: {
      type: String,
    },
    img: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    preparation_cost: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    sales_tax: {
      type: Number,
    },
    options: [
      {
        name: {
          type: String,
          required: true,
        },
        priority: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        preparation_cost: {
          type: Number,
          required: true,
        },
      },
    ],
    addOn: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        preparation_cost: {
          type: Number,
          required: true,
        },
      },
    ],
    deleteStatus: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("dishes", dishesSchema);
