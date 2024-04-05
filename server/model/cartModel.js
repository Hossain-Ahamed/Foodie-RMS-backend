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

    dish_id: { 
      type: mongoose.ObjectId, 
     ref: "dishes", 
     required: true 
    },
    quantity: { 
      type: Number 
    },
    addOn: [
        {
        type: String,
        }
      ],
    order_from:{
      type:String,
      enum:["ONSITE","OFFSITE"],
      default:"ONSHORE"
    },
    options : {
      type: String,
    },
    img:{
      type:String,
    },
    basePrice:{
      type:Number
    },
    totalPrice:{
      type:Number,
    },
    extraPrice:{
      type:Number
    },
    order_note:{
      type:String
    },
    VAT:{
      type:Number
    }

  },
  { timestamps: true }
);

module.exports= mongoose.model("CartItem", cartSchema);