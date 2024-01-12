const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        category_name:{
            type: String,
            required: true,
        },
        img:{
            type: String,
        },
        category_slug:{
            type: String,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        shortdescription:{
            type: String,
        },
    },
    { timestamps: true }
);
module.exports= mongoose.model("Category", categorySchema);