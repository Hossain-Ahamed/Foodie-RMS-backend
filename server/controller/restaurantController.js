// const {createUserAccount} = require("../config/firbase-config.js");
const branchModel = require("../model/branchModel.js");
const uuid = require("uuid");
const createClient = require("./clientController.js");
const { upload } = require("../../multer.js");
const fs = require("fs");
const employeeModel = require("../model/employeeModel.js");
const restaurantModel = require("../model/restaurantModel.js");

const createResturant = async (req, res) => {
  try {
    const {
      res_name,
      res_email,
      res_mobile,
      res_Owner_Name,
      res_Owner_city,
      res_Owner_email,
      res_Owner_mobile,
      res_Owner_streetAddress,
      res_Owner_stateProvince,
      res_Owner_postalCode,
      res_Owner_country,
      branches,
      img,
    } = req.body;
    console.log(res_name, req.body);
    // const { img } = req.file;
    // upload.single(img);
    // const filename = req.file.filename;
    // const fileUrl = path.join(filename);
    if (!res_name || !res_email || !res_mobile) {
      return res.status(400).json({
        message: "All fields are required Please provide all the details.",
      });
    } else {
      const newResturant = await restaurantModel({
        res_name,
        res_email,
        res_mobile,
        res_Owner_Name,
        res_Owner_email,
        res_Owner_mobile,
        res_Owner_city,
        res_Owner_streetAddress,
        res_Owner_stateProvince,
        res_Owner_postalCode,
        res_Owner_country,
        // img: fileUrl,
        img,
      }).save();
      const branchData = branches[0];
      const newBranch = await branchModel({
        res_id: newResturant._id,
        branch_name: branchData.name,
        streetAddress: branchData.streetAddress,
        city: branchData.city,
        postalCode: branchData.postalCode,
        country: branchData.country,
        stateProvince: branchData.stateProvince,
      }).save();
      const newEmployee = await employeeModel({
        f_name: res_Owner_Name,
        email: res_Owner_email,
        mobile: res_Owner_mobile,
        streetAddress: res_Owner_streetAddress,
        city: res_Owner_city,
        stateProvince: res_Owner_stateProvince,
        postalCode: res_Owner_postalCode,
        country: res_Owner_country,
        permitted: [
          {
            res_id: newResturant._id,
            branchID: newBranch._id,
            role: "Super-Admin",
          },
        ],
      }).save();
      res.status(200).send({ branchID: newBranch?._id });
    }
  } catch (error) {
    console.log("Error in creating restaurant", error);
    return res.status(500).json({
      message: "error occured while creating",
    });
  }
};

//create user account

// const createAccount = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const password = uuid.v4();
//     const user = await restaurantModel.findOne({ res_Owner_email: email });
//     if (!user) {
//       createUserAccount({ email, password });
//       createClient({ email, password });
//       res.status(200).send(true);
//     } else {
//       res.status(409).send(false);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const sendRestaurantData = async (req, res) => {
  try {
    const id = req.params;
    const data = await restaurantModel.findOne({ _id: id });
    res.status(200).send(data);
  } catch (error) {
    return res.status(401).json({
      Error: "Error In getiing Data",
    });
  }
};

const updateResturant = async (req, res) => {
  const { _id } = req.params;
  const {
    res_name,
    res_email,
    res_mobile,
    res_Owner_Name,
    res_Owner_city,
    res_Owner_email,
    res_Owner_mobile,
    res_Owner_streetAddress,
    res_Owner_stateProvince,
    res_Owner_postalCode,
    res_Owner_country,
    img,
  } = req.body;

  try {
    let updatedData = await restaurantModel.findByIdAndUpdate(
      _id,
      {
        res_name,
        res_email,
        res_mobile,
        res_Owner_Name,
        res_Owner_email,
        res_Owner_mobile,
        res_Owner_city,
        res_Owner_streetAddress,
        res_Owner_stateProvince,
        res_Owner_postalCode,
        res_Owner_country,
        img,
      },
      { new: true }
    );

    res.status(200).send(true);
  } catch (err) {
    console.log("Error In Updating Data", err);
    return res.status(401).json({
      Error: "Error In updating Data",
    });
  }
};

// =================================Delete Functions==================================
const deleteResturent = async (req, res) => {
  try {
    const id = req.params.id;
    const resturent = await restaurantModel.findByIdAndUpdate(
      id,
      {
        deleteStatus: true,
      },
      { new: true }
    );

    if (!resturent) {
      return res.status(404).json({ msg: "resturent not found" });
    }

    res.status(200).json({ msg: "Resturent deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllResturants = async (req, res) => {
  try {
    const categories = await restaurantModel.find({ deleteStatus: false });
    // console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllResturantsForDev = async (req, res) => {
  try {
    const restaurantList = await restaurantModel
      .find({ deleteStatus: false })
      .select("_id img res_name");
    res.status(200).send(restaurantList);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};




module.exports = {
  getAllResturantsForDev,
  getAllResturants,
  createResturant,
  updateResturant,
  deleteResturent,
  sendRestaurantData,
  // createAccount,
};
