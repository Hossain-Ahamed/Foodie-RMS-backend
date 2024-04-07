const { response } = require("express");
const membership = require("../model/membershipModel");
const userModel = require("../model/userModel");
const User = require("../model/userModel");
const { responseError } = require("../utils/utility");

const getMembershipDetailsById = async (req, res) => {
  try {
    const { res_id } = req.params;
    let data = await membership.findOne({ res_id: res_id });
    if (data) {
      return res.status(200).send(data);
    } else {
      let data = await membership({
        res_id,
      }).save();
      
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const searchMember = async(req,res)=>{
  try {
    const {res_id} = req.params;
    const {phone} = req.query;
    if(!phone){
      res.status(400).send(false);
    }
    const regexPattern = new RegExp(phone,'i');
    const users = await User.find({phone:{$regex : regexPattern}}).select("_id name phone email imgURL firebase_UID").exec() ;
    if(!users){
      res.status(404).send(false);
    }
    res.status(200).send(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateMembership = async (req, res) => {
  try {
    const { res_id } = req.params;
    const {
      rules,
      MaximumLimit_in_TK,
      percentageOffer,
      MinimumOrderAmountTillNow,
      singleTimeMinimumOrderAmount,
    } = req.body;
    await membership.findOneAndUpdate(
      { res_id: res_id },
      {
        $set: {
          rules,
          MaximumLimit_in_TK,
          percentageOffer,
          MinimumOrderAmountTillNow,
          singleTimeMinimumOrderAmount,
        },
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addNewMembership =  async (req, res) => {
  try {
    const {res_id} = req.params;
    const {_id} = req.body;

    try {
      const checkUser = await userModel.findById({ _id }).exec();
      if(!checkUser){
        return res.status(403).send("Invalid User");
      }else{
        const updateMembership = await membership.findOneAndUpdate({res_id : res_id},
          { $push: 
            { memberShip: _id }  });

          res.status(200).send(true);

      }

    } catch (error) {
      responseError(res,500, error, "error while update data");
    }

  } catch (error) {
    responseError(res,500, error, "Internal server error");
  }
}
const deleteMembership = async (req, res) => {
  try {
    const { res_id ,_id } = req.params;

    // Update the membership document
    const updatedMembership = await membership.findOneAndUpdate(
      { res_id: res_id },
      { $pull: { memberShip:_id} },
      { new: true }
    );

    if (!updatedMembership) {
      return res.status(404).send("Membership not found");
    }

    // Send response with the updated membership document
    res.status(200).send(updatedMembership);
  } catch (error) {
    // Handle errors
    responseError(res, 500, error, "Internal server error");
  }
};

const getMembershipUserData = async (req,res)=>{
  try {
    const {res_id } = req.params;

    const userData = await membership.findOne({ res_id: res_id }).populate({
      path: "memberShip",
      select: "_id  name email phone imgURL firebase_UID"
    });
    res.status(200).send(userData?.memberShip)
  } catch (error) {
    responseError(res, 500, error, "Internal server error");
  }
}

module.exports = {
  updateMembership,
  getMembershipDetailsById,
  searchMember,
  addNewMembership,
  deleteMembership,
  getMembershipUserData,
};
