const clientModel = require("../model/clientModel.js");

const createClient = ({ email, password }) => {
  try {
    clientModel({
      email,
      password,
    }).save();
  } catch (error) {
    console.log("Error in creating restaurant", error);
  }
};

module.exports = createClient;
