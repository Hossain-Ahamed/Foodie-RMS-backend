const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
  },
  user_id: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  token: {
    type: String,
  },

  status: {
    type: String,
  },
  totalAmount: {
    type: String,
  },
  Items: [
    {
      dishID: {
        type: mongoose.ObjectId,
        ref: "dishes",
      },
      dishQuantity: {
        type: String,
      },
      title: {
        type: String,
      },
      dishTotalPrice: {
        type: Number,
      },
      dishStatus: {
        type: String,
        default: "Accepted",
        enum: ["Accepted", "Processing", "Processed", "Delivered", "Cancelled"],
      },
      addOn: [
        {
          name: {
            type: String,
          },
          price: {
            type: Number,
          },
        },
      ],
      options: [
        {
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],

  orderNote: {
    type: String,
  },
  address: {
    type: String,
  },
  vouchers: {
    type: String,
    default: "",
  },
  subTotalPrice: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Payment Pending",
    enum: [
      "Payment Pending",
      "Processing",
      "Processed And Ready to Ship",
      "Shipped",
      "Ready To Delivery",
      "Delivered",
      "Cancelled",
    ],
  },
  cash_status: {
    type: String,
    default: "Not Paid",
    enum: ["Not Paid", "Cash Recieved", "Not Refunded", "Refunded"],
  },
  type_of_payment: {
    type: String,
    enum: ["Bkash", "Roket", "Nagad", "Card", "Cash On Delivery (COD)"],
  },
  transactionId: {
    type: String,
  },
  OTP: {
    type: String,
  },
  table: {
    type: String,
  },
  deliveryPartner: {
    _id: {
      type: mongoose.ObjectId,
      ref: "Employees",
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  phone: {
    type: String,
  },
  orderStatus: [
    {
      name: {
        type: String,
      },
      message: {
        type: String,
      },
      time: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("order", orderSchema);
