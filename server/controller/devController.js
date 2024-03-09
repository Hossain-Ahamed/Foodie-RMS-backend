const { createUserAccount } = require("../config/firbase-config");
const devModel = require("../model/devModel");
const { responseError } = require("../utils/utility");
const uuid = require("uuid");
const getAllDev = async (req, res) => {
  try {
    const dev = await devModel.find({deleteStatus: "false"}).select("-password");
    res.status(200).send(dev);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "server error" });
  }
};

const CreateDev = async (req, res) => {
  try {
    const {
      f_name,
      l_name,
      email,
      mobile,
      gender,
      DOB,
      nid,
      role,
      commentNotes,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      emergencyName,
      emergencyRelation,
      emergencyPhoneNumber,
      emergencyEmail,
      emergencyAddress,
      profilePhoto,
    } = req.body;
    // console.log(req.body);

    const password = uuid.v4().slice(0, 8);
    //creating id in firebase
    createUserAccount({ email, password: password }).then(async (data) => {
      const Createdev = await devModel({
        uid: data.uid,
        f_name,
        l_name,
        email,
        mobile,
        gender,
        password,
        DOB,
        nid,
        role,
        commentNotes,
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
        emergencyName,
        emergencyRelation,
        emergencyPhoneNumber,
        emergencyEmail,
        emergencyAddress,
        profilePhoto,
      }).save();
      res.status(200).send(true);
    });
  } catch (error) {
    responseError(res, 500, error);
  }
};

const devFindByUID = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = await devModel.findOne({ uid: uid }).select("-password");
    res.status(200).send(data);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const getDevProfile = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      responseError(res, 404, {}, "No data is found because of no email");
    }
    const data = await devModel.findOne({ email: email }).select("-password");
    res.status(200).send(data);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      responseError(res, 404, {}, "No data is found because of no email");
    }
    const data = await devModel.findOne({ email: email }).select("-password");
    res.status(200).send(data);
  } catch (error) {
    responseError(res, 500, error);
  }
};

//delete dev account
const deleteDevAccount = async (req, res) => {
  try {
    //removing from database mongodb
    const {_id} = req.params;
    // const data = await devModel.findOne({ _id: _id });
    // console.log(data)
    const data = await devModel.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
    res.status(200).send(data);
    //removeing from firebase
  } catch (error) {
    responseError(res, 500, error);
  }
};

module.exports = {
  devFindByUID,
  CreateDev,
  getAllDev,
  getDevProfile,
  deleteDevAccount,
};
