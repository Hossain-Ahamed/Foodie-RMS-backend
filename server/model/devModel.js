const mongoose = require("mongoose");

const devSchema = new mongoose.Schema(
  {
    uid:{
        type:String
    },
    password:{
        type:String
    },
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    nid: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    stateProvince: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    emergencyAddress: {
      type: String,
      required: true,
    },
    emergencyEmail: {
      type: String,
      required: true,
    },
    emergencyName: {
      type: String,
      required: true,
    },
    emergencyPhoneNumber: {
      type: String,
      required: true,
    },
    emergencyRelation: {
      type: String,
      required: true,
    },
    role:{
        type:String,
    },
    commentNotes:{
        type:String,

    },
    deleteStatus: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("dev", devSchema);
