const mongoose =  require("mongoose");

const cartSchema = new mongoose.Schema(
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
    user_id: {
      type: mongoose.ObjectId,
      ref: "users",
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
    order_from:{
      type:String,
      enum:["ONSHORE","OFFSHORE"],
      default:"ONSHORE"
    }
  },
  { timestamps: true }
);

module.exports= mongoose.model("CartItem", cartSchema);