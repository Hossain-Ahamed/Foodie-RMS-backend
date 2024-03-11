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
    // res.status(200).send(getAllBranch()); //return updated branch list after deleting the selected one from dev payment list
  } catch (err) {}
};

module.exports = {
  deleteBranchFromDevPaymentList,
};
