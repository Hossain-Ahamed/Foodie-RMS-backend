const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
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
    user_name: {
      type: String,
    },
    user_phone: {
      type: String,
    },
    table_number: {
      type: String,
    },
    date: {
      type: Date,
    },
    timeSlot: {
      type: String,
    },
    numberOfPeople: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
