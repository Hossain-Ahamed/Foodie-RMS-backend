const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        R_name:{
            type: String,
            required: true,
        },
        R_email:{
            type: String,
            required: true,
        },
        R_mobile:{
            type: String,
            required: true,
        },
        Owner_name:{
            type: String,
            required: true,
        },
        Owner_email:{
            type: String,
            required: true,
        },
        Owner_mobile:{
            type: String,
            required: true,
        },
        Owner_streetAddress:{
            type: String,
            required: true,
        },
        Owner_city:{
            type: String,
            required: true,
        },
        Owner_stateProvince:{
            type: String,
            required: true,
        },
        Owner_postalCode:{
            type: String,
            required: true,
        },
        Owner_country:{
            type: String,
            required: true,
        },
        Owner_img:{
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Restaurants", restaurantSchema);