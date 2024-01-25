const mongoose =  require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    item: [
      {
        _id: {
          type: mongoose.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports= mongoose.model("CartItem", cartSchema);