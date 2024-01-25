const mongoose = require("mongoose");

const offerSchema = new mongoose.schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    offerFor:{type:String },
    startDate:{type:String},
    endDate:{type:String},
    
},
{ timestamps: true })
module.exports = mongoose.model("Offer", offerSchema);
