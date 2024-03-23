const branchModel = require("../model/branchModel");
const restaurantModel = require("../model/restaurantModel");
const subscriptionModel = require("../model/subscriptionModel");
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
        $match: {
          "subscriptions.deleteStatus":"false",
        },
      },
      {
        $sort: { "subscriptions.endDate": 1 }, // Sort by subscription end date in descending order
      },
    ]);
    const transformedData = data.map((branch) => {
      const subscription = branch.subscriptions;

      return {
        _id: subscription._id,
        streetAddress: branch.streetAddress,
        city: branch.city,
        res_id: subscription.res_id,
        res_name: branch.restaurant[0].res_name,
        branch_name: branch.branch_name,
        branchID: branch._id,
        isActive: subscription.isActive,
        subscriptionStart: new Date(subscription.startDate).toISOString(),
        subscriptionEnd: new Date(subscription.endDate).toISOString(),
        amount: subscription.previousSubscriptions[0].price,
        payment_time: new Date(
          subscription.previousSubscriptions[0].payment_time
        ).toISOString(),
        transaction_id: subscription.previousSubscriptions[0].transactionID,
        payment_method: "card", // Assuming a default value, modify as needed
        payment_status: subscription.previousSubscriptions[0].paymentStatus
          ? "Paid"
          : "Not Paid",
      };
    });

    res.status(200).json(transformedData);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const addTables = async (req, res) => {
  try {
    const { branchID } = req.params;
    const { number, capacity, location } = req.body;
    console.log(number, capacity, location);
    const branch = await branchModel.findById({ _id: branchID });
    if (!branch) {
      responseError(res, 404, error);
    } else {
      const qrCodeData = 
        "/restaurant/ " +
        branch.res_id +
        "/branch/" +
        branch._id +
        "?table=" +
        number;
        const updateTable = await branchModel.findByIdAndUpdate(
          branch._id,
          {
            $push: {
              tables: {
                number: number,
                capacity: capacity,
                location: location,
                qrCodeData: qrCodeData
              }
            }
          },
          { new: true }
        );
        console.log("updateTable", updateTable);
      res.status(200).send(updateTable);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const getBranchesTable = async (req, res) => {
  const { branchID } = req.params;
  try {
    const branches = await branchModel.findOne({_id:branchID}).select("tables").lean(); // Using lean() to convert mongoose documents to plain JavaScript objects
    if(!branches){
      responseError( res, 404 , 'No branches found');
    }
    if(branches?.tables && Array.isArray(branches.tables)) 
    {// Preprocess each branch before sending it to the frontend
      const modifiedTables = branches.tables.map(table => {
        if (table.qrCodeData) {
          table.qrCodeData = process.env.LINK + table.qrCodeData;
        }
        return table;
      });
    res.status(200).send(modifiedTables);
    }else{
      res.status(200).send([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const barnchTableDelete = async (req,res) =>{
  const { branchID,number } = req.params;
  
  try {
    const branch = await branchModel.findOneAndUpdate(
        { _id:branchID }, // Find the branch containing the table with number = 2
        { $pull: { tables: { number: number } } }, // Remove the table with number = 2
        { new: true }
    );
    res.status(200).send(true);
    console.log("Branch after deletion:", branch);
} catch (error) {
    console.error("Error:", error);
    }
}

const getAllBranchForDev = async (req, res) => {
  try {
    const { res_id } = req.params;
    const resDetails = await restaurantModel.findById({ _id: res_id });
    const branchList = await branchModel
      .find({
        res_id: res_id,
        deleteStatus: false,
      })
      .select(
        "_id branch_name streetAddress city stateProvince country paymentTypes"
      );

    res.status(200).send({
      restaurantDetails: resDetails,
      branches: branchList,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const singleBranchDataForDev = async (req, res) => {
  try {
    const { branchID } = req.params;
    const data = await branchModel
      .findById(branchID)
      .select(
        "branch_name streetAddress city stateProvince country paymentTypes"
      );
    const transactionData = await subscriptionModel
      .findOne({ branchID: branchID })
      .select("previousSubscriptions");
    if (data && transactionData) {
      res.status(200).send({
        branchDetails: data,
        transactionData,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const showBusinessHours = async (req,res)=>{
  const {res_id,branchID} = req.params;
  
  try{
    const data = await branchModel.findById({_id:branchID},"shift").lean();
    console.log(data);
    res.status(200).send(data.shift);
  }
  catch(e){
    console.log(e);
    res.status(400).send("Error getting business hours")

  }


}

const modifyBusinessHours = async (req,res)=>{
  const {res_id,branchID} = req.params;
  //const {data} = req.body;
  console.log(req.body,"this is the data in controller");
  
  try{
    const data1 = await branchModel.findByIdAndUpdate({_id:branchID},{shift:req.body},{new:true});
    console.log(data1);
    res.status(200).send(true);
  }
  catch(e){
    console.log(e);
    res.status(400).send("Error getting business hours")

  }


}

const showPaymentType = async (req,res)=>{
  const {res_id,branchID} = req.params;
  
  try{
    const data = await branchModel.findById({_id:branchID}).select("paymentTypes , takewayCharge , deliveryCharge").lean();
    console.log(data);
   res.status(200).send(data);
  }
  catch(e){
    console.log(e);
    res.status(400).send("Error getting business hours")

  }


}

const modifyPaymentType = async (req,res)=>{
  const {res_id,branchID} = req.params;
  const{paymentTypes,
    takewayCharge,
    deliveryCharge} = req.body;
  
    console.log(req.body)
  try{
    const data =await branchModel.findByIdAndUpdate({_id:branchID},{paymentTypes,
      takewayCharge,
      deliveryCharge},{new:true});
    console.log(data);
   res.status(200).send(data);
  }
  catch(e){
    console.log(e);
    res.status(400).send("Error getting business hours")

  }


}

module.exports = {
  addTables,
  getAllBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  getAllBranchForDev,
  singleBranchDataForDev,
  showBusinessHours,
  modifyBusinessHours,
  showPaymentType,
  modifyPaymentType,
  getBranchesTable,
  barnchTableDelete
};
