const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    res_name: {
      type: String,
      required: true,
    },
    res_email: {
      type: String,
      required: true,
    },
    res_mobile: {
      type: String,
      required: true,
    },
    res_Owner_Name: {
      type: String,
      required: true,
    },
    res_Owner_email: {
      type: String,
      required: true,
    },
    res_Owner_mobile: {
      type: String,
      required: true,
    },
    res_Owner_streetAddress: {
      type: String,
      required: true,
    },
    res_Owner_city: {
      type: String,
      required: true,
    },
    res_Owner_stateProvince: {
      type: String,
      required: true,
    },
    res_Owner_postalCode: {
      type: String,
      required: true,
    },
    res_Owner_country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    deleteStatus: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurants", restaurantSchema);
