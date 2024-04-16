const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      
    },
    l_name: {
      type: String,
      
    },
    email: {
      type: String,
      
    },
    gender: {
      type: String,
      
    },
    DOB: {
      type: String,
      
    },
    nid: {
      type: String,
    },
    mobile: {
      type: String,
      
    },

    profilePhoto: {
      type: String,
    },
    streetAddress: {
      type: String,
      
    },
    city: {
      type: String,
      
    },
    stateProvince: {
      type: String,
      
    },
    postalCode: {
      type: String,
      
    },
    country: {
      type: String,
      
    },
    emergencyAddress: {
      type: String,
      
    },
    emergencyEmail: {
      type: String,
      
    },
    emergencyName: {
      type: String,
      
    },
    emergencyPhoneNumber: {
      type: String,
      
    },
    emergencyRelation: {
      type: String,
      
    },
    
    permitted: [
      {
        res_id: {
          type: mongoose.ObjectId,
          ref: "Restaurants",
        },
        branchID: {
          type: mongoose.ObjectId,
          ref: "Branches",
        },
        role: {
          type: String,
        },
        salary_type: {
          type: String,
          enum: ["Hourly", "Daily", "Monthly"],
          
        },
        salary_unit: {
          type: Number, //hourly wage or daily rate or monthly salary
          
        },
      },
    ],
    deleteStatus: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employees", employeeSchema);
