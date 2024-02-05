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
    address: {
      type: String,
    },
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
