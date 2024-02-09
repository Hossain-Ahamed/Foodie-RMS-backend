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
        },
        closingTime: {
          type: String,
        },
      },
      Monday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      Tuesday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      Wednesday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      Thursday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      Friday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      Saturday: {
        openingTime: {
          type: String,
        },
        closingTime: {
          type: String,
        },
      },
      default: {
        openingTime: "9.00",
        closingTime: "22.00",
      },
    },
    paymentTypes: {
      type: String,
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
  },

  { timestamps: true }
);

module.exports = mongoose.model("Branchs", branchSchema);
