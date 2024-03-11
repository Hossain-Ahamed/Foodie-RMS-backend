const Subscription = require("../model/subscriptionModel");
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
  } catch (err) {}
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

module.exports = {
  deleteBranchFromDevPaymentList,
  deactivateBranchFromDevPaymentList,
};
