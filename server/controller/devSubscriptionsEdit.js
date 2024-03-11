const Subscription = require("../model/subscriptionModel");
const restaurantModel = require("../model/restaurantModel.js");
const sendMail = require("../utils/sendEmail.js");
const { getAllBranch } = require("../controller/branchController.js");

const deleteBranchFromDevPaymentList = async (req, res) => {
  try {
    const _id = req.params._id;
    await Subscription.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const deactivateBranchFromDevPaymentList = async (req, res) => {
  try {
    const _id = req.params._id;
    const { status } = req.body;
    const newStatus = status ? false : true;
    await Subscription.findByIdAndUpdate(
      _id,
      {
        isActive: newStatus,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {}
};

const notifyOwnerFromDev = async (req, res) => {
  try {
    const { streetAddress, city, res_id, subscriptionEnd } = req.body.data;
    const _id = req.params._id;
    const restaurant = await restaurantModel.findOne({_id:res_id});
    if (restaurant) {
      sendMail({
        email: restaurant.res_email,
        subject: "Subscription Renewal Notice",
        to: restaurant.res_email,
        message: `Hello ${restaurant.res_Owner_Name}, your restaurant's branch ${streetAddress}, ${city} will end in ${subscriptionEnd}`,
      });
    }
    res.status(200).send(true);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

module.exports = {
  deleteBranchFromDevPaymentList,
  deactivateBranchFromDevPaymentList,
  notifyOwnerFromDev,
};
