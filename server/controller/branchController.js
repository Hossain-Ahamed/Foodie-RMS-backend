const branchModel = require("../model/branchModel");

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
        deleteStatus,
      } = req.body;
      if (branchModel.findOne({ branch_name:branch_name, res_id:res_id })) {
        return res.status(400).send({
          success: false,
          message: "Branch Already Exists",
        });
      }
  
      const branch = await new branchModel({
        res_id,
        branch_name,
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
        deleteStatus,
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
        deleteStatus,
      } = req.body;
      const _id = req.params._id;
      const branch = await branchModel.findByIdAndUpdate(_id,
        {
            res_id,
            branch_name,
            streetAddress,
            city,
            stateProvince,
            postalCode,
            country,
            deleteStatus,
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

  module.exports = {
    createBranch,
    updateBranch,
    deleteBranch,
  };