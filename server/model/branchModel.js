const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    res_id: {
      type: mongoose.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    stateProvince: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    deleteStatus: {
      type: String,
      default: false,
    },
    shift: {
      Sunday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Monday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Tuesday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Wednesday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Thursday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Friday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
      Saturday: {
        openingTime: {
          type: String,
          default: "09:00",
        },
        closingTime: {
          type: String,
          default:"22:00"
        },
      },
    },
    paymentTypes: {
      type: String,
      default: "PayLater",
    },
    tables: [
      {
        number: {
          type: String,
        },
        capacity: {
          type: String,
        },
        location: {
          type: String,
        },
        qrCodeData: {
          type: String,
        },
      },
    ],
    printingSetup: {
      print_res_email: {
        type: Boolean,
      },
      print_res_mobile: {
        type: Boolean,
      },
      print_address: {
        type: Boolean,
      },
      print_logo: {
        type: Boolean,
      },
      print_kitchen_print: {
        type: Boolean,
      },
      headerText: {
        type: String,
      },
      greetingText: {
        type: String,
      },
    },
    takewayCharge: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 50,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Branchs", branchSchema);
