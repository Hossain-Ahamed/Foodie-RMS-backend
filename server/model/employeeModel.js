const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    res_id:{
        type: mongoose.ObjectId,
         ref: "Restaurants",
         required: true,
    },
    f_name:{
        type: String,
        required: true
    },
    l_name:{
        type: String,
        required: true
    },
    branch_name:{
        type:String,
        required:true

    },
    branchID:{
        type: mongoose.branchID,
         ref: "Branchs",
         required: true,
    },
    email:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    DOB:{
        type: String,
        required: true
    },
    nid:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },

    profilePhoto:{
        type: [String],
        required: true
    },
    streetAddress:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    stateProvince:{
        type: String,
        required: true
    },
    postalCode:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    emergencyAddress:{
        type: String,
        required: true
    },
    emergencyEmail:{
        type: String,
        required: true
    },
    emergencyName:{
        type: String,
        required: true
    },
    emergencyPhoneNumber:{
        type: String,
        required: true
    },
    emergencyRelation:{
        type: String,
        required: true
    },
    salary_type:{
        type:String,
        enum:['Hourly','Daily','Monthly'],
        required:true,
    },
    salary_unit:{
        type: Number,  //hourly wage or daily rate or monthly salary
        required:true,
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Employees", employeeSchema);
