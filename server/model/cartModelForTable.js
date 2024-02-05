const mongoose =  require("mongoose");

const cartSchemaForTable = new mongoose.Schema(
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
    table_id: {
      type: mongoose.ObjectId,
      ref: "Tables",
      required: true,
    },
    Items: [
      {
        dishID: { 
      type: mongoose.ObjectId, 
     ref: "dishes", 
     required: true 
    },
        dishQuantity: { 
      type: String 
    },
        dishTotalPrice: { 
      type: Number 
    },
    addOn: [
      {
        name: {
        type: String,
        required: true,
        },
        price: {
        type: Number,
        required: true,
        }
      },
      ],
      },
    ],
  },
  { timestamps: true }
);

module.exports= mongoose.model("CartItemForTable", cartSchemaForTable);