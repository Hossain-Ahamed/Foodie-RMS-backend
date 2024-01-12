const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        R_name:{
            type: String,
            required: true,
        },
        B_name:{
            type: [String],
            default: [],
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Restaurants", restaurantSchema);