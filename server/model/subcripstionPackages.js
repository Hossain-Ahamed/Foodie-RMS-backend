const mongoose = require("mongoose");

const subscriptionPackagesSchema =  new mongoose.Schema({
    packageType:{
        type:String,
        require:true,
    },
    shortDescription:{
        type:String,
        require:true
    },
    finalPrice:{
        type:String,
        require:true
    },
    cutPrice:{
        type:String,
        require:true
    }


})


module.exports =mongoose.model('subscriptionPackages',subscriptionPackagesSchema)