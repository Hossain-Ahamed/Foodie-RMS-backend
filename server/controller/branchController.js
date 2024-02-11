const branchModel = require("../model/branchModel");
const { responseError } = require("../utils/utility");

// create branch

const createBranch = async (req, res) => {
  try {
    const {
      res_id,
      branch_name,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
    } = req.body;
    //   if (branchModel.findOne({ branch_name:branch_name, res_id:res_id })) {
    //     return res.status(400).send({
    //       success: false,
    //       message: "Branch Already Exists",
    //     });
    //   }

    const branch = await new branchModel({
      res_id,
      branch_name,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
    }).save();
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(400).send(false);
  }
};

//update Branch
const updateBranch = async (req, res) => {
  try {
    const {
      res_id,
      branch_name,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
    } = req.body;
    const _id = req.params._id;
    const branch = await branchModel.findByIdAndUpdate(
      _id,
      {
        res_id,
        branch_name,
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(false);
  }
};

//delete branch
const deleteBranch = async (req, res) => {
  try {
    const _id = req.params._id;
    await branchModel.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
  } catch (err) {}
};
const getAllBranch = async (req, res) => {
  try {
    const data = await branchModel.aggregate([
      {
        $lookup: {
          from: "subscriptions", // Name of the subscription model collection
          localField: "_id", // Field from the branch model
          foreignField: "branchID", // Field from the subscription model
          as: "subscriptions",
        },
      },
      {
        $unwind: "$subscriptions", // If there can be multiple subscriptions for a branch
      },
      {
        $lookup: {
          from: "restaurants", // Assuming the name of the restaurant model collection
          localField: "subscriptions.res_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $sort: { "subscriptions.endDate": -1 }, // Sort by subscription end date in descending order
      },
    ]);
    const transformedData = data.map((branch) => {
      const subscription = branch.subscriptions;

      return {
        res_id: subscription.res_id,
        res_name: branch.restaurant[0].res_name,
        branch_name: branch.branch_name,
        branchID: branch._id,
        subscriptionStart: new Date(subscription.startDate).toISOString(),
        subscriptionEnd: new Date(subscription.endDate).toISOString(),
        amount: subscription.previousSubscriptions[0].price,
        payment_time: new Date(subscription.previousSubscriptions[0].endDate).toISOString(),
        transaction_id: subscription.previousSubscriptions[0].transactionID,
        payment_method: "card", // Assuming a default value, modify as needed
        payment_status: subscription.previousSubscriptions[0].paymentStatus ? "Paid" : "Not Paid",
      };
    });

    res.status(200).json(transformedData.reverse());
  } catch (error) {
    responseError(res, 500, error);
  }
};

module.exports = {
  getAllBranch,
  createBranch,
  updateBranch,
  deleteBranch,
};
