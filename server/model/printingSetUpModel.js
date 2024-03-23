const mongoose = require("mongoose");

const printingSetUpSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
    },
    headerText: {
      type: String,
    },
    greetingText: {
      type: String,
    },
    print_address: {
      type: Boolean,
      default: false,
    },
    print_logo: {
      type: Boolean,
      default: false,
    },
    print_res_email: {
      type: Boolean,
      default: false,
    },
    print_res_mobile: {
      type: Boolean,
      default: false,
    },
    print_kitchen_print: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("printingSetUp", printingSetUpSchema);
