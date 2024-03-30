const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    DOB: {
      type: Number,
    },
    address: [
      {
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
    ],
    imgURL: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
 