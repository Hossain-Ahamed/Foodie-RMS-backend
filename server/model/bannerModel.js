const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  site: {
    type: String,
  },
  img: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("banner", bannerSchema);
