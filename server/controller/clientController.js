const clientModel = require("../model/clientModel.js");

const createClient = ({ email, password }) => {
  try {
    clientModel({
      email,
      password,
    }).save();
    res.status(200).send({ massage: "Sucess" });
  } catch (error) {
    console.log("Error in creating restaurant", error);
    return res.status(500).json({
      success: false,
    });
  }
};

module.exports = createClient;
