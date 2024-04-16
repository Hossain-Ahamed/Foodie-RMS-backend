const mongoose = require( 'mongoose' );
const facebookappidSchema = new mongoose.Schema({
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
    },
    branchID: {
      type: mongoose.ObjectId,
      ref: "Branches",
    },
    appID: {
      type: String,
    },
    pageID: {
      type: String,
    },

  });
  module.exports = mongoose.model("facebookappid", facebookappidSchema);