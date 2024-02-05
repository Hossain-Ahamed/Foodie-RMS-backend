const mongoose = require ('mongoose');

const tableSchema =  new mongoose.Schema({
    res_id: {
        type: mongoose.ObjectId,
        ref: "Restaurants",
        required: true,
      },
      branchID: {
      type: mongoose.ObjectId,
      ref: "Branchs",
      required: true,
      },
    number: { 
        type : String , 
        required : true 
    },
    capacity :{
        type : Number,
        required:true
    },
    status:{
        type:String,
        enum:["Occupied","Vacant"],
        default:"Vacant"
    }
});

module.exports =mongoose.model("Tables",tableSchema);