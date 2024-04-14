const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branches",
    },
    user_id: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    token: {
      type: Number,
    },
    Items: [
      {
        dish_id: {
          type: mongoose.ObjectId,
          ref: "dishes",
        },
        quantity: {
          type: Number,
        },
        title: {
          type: String,
        },
        img: {
          type: String,
        },
        totalPrice: {
          type: Number,
        },
        dishStatus: {
          type: String,
          default: "Order-Placed",
          enum: [
            "Order-Placed",
            "Approved",
            "Processing",
            "Processed",
            "Delivered",
            "Cancelled",
          ],
        },
        basePrice: {
          type: Number,
        },
        totalPrice: {
          type: Number,
        },
        extraPrice: {
          type: Number,
        },
        VAT: {
          type: Number,
        },
        addOn: [
          {
            type: String,
          },
        ],
        options: {
          type: String,
        },
      },
    ],

    orderNote: {
      type: String,
    },
    address: {
      streetAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      stateProvince: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
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
        "In The Kitchen",
        "Ready to serve",
        "Processed And Ready to Ship",
        "Shipped",
        "Ready To Delivery",
        "Delivered",
        "Completed",
        "Cancelled",
        "New Dish Added"
      ],
    },
    cash_status: {
      type: String,
      default: "Not Paid",
      enum: ["Not Paid", "Paid", "Not Refunded", "Refunded"],
    },
    type_of_payment: {
      type: String,
      enum: ["Bkash", "Roket", "Nagad", "Card", "Cash On Delivery (COD)"],
      default: "Cash On Delivery (COD)",
    },
    order_from: {
      type: String,
      enum: ["ONSITE", "OFFSITE"],
      default: "ONSITE",
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
      Employee_id: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
