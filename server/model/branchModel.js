const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
    {
        res_id:{
            type: mongoose.ObjectId,
            ref: "Restaurants",
            required: true,
        },
        branch_name:{
            type: String,
            required: true,
        },
        streetAddress:{
            type: String,
            required: true,
        },
        city:{
            type: String,
            required: true,
        },
        stateProvince:{
            type: String,
            required: true,
        },
        postalCode:{
            type: String,
            required: true,
        },
        country:{
            type: String,
            required: true,
        },
        deleteStatus:{
            type: String,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Branchs", branchSchema);