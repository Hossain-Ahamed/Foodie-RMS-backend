const mongoose = require("mongoose");

const clientSchema = new mongoose.schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Clients", clientSchema);