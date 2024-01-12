const mongoose =  require("mongoose");

const dishesSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    slugName:{
        type: String,
        lowercase: true,
    },
    R_name:{
        type: String,
        required: true
    },
    B_name:{
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    shortdescription:{
        type: String,
    },
    img:{
        type: String,
    },
    MRP:{
        type: Number,
        required: true,
    },
    sellingPrice:{
        type: Number,
    },
    category_name:{
        type: String,
        required: true,
    },
    category_slug:{
        type: String,
        lowercase: true,
    },
    images:{
        type:[String],
        default:[],
    },
    percentage:{
        type: Number,
    },
    preparationPrice:{
        type:Number,
        required:true,
    },
    addOn:{
        type:[String],
        required:[],
    }

},
{timestamps: true}
);
module.exports = mongoose.model("dishes", dishesSchema);