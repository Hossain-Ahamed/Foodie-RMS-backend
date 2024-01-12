const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    f_name:{
        type: String,
        required: true
    },
    l_name:{
        type: String,
        required: true
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
    nId:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    commentNotes:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        required: true
    },
    streetNo:{
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
    emergencyNumber:{
        type: String,
        required: true
    },
    emergencyRelation:{
        type: String,
        required: true
    },

},
{ timestamps: true }
);

module.exports = mongoose.model("Employees", employeeSchema);
