const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
  },
  branchID: {
    type: mongoose.ObjectId,
    ref: "Branchs",
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});
module.exports = mongoose.model("Customer", customerSchema);
