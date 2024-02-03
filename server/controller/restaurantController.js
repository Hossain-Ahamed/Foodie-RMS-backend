const resturantModel = require("../model/restaurantModel.js");

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
      img,
    } = req.body;
    if (!res_name || !res_email || !res_mobile) {
      return res
        .status(400)
        .json({
          message: "All fields are required Please provide all the details.",
        });
    } else {
      const newResturant = await resturantModel({
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
      }).save();

      res.status(200).send({ massage: "Sucess" });
    }
  } catch (error) {
    console.log("Error in creating restaurant", error);
    return res.status(500).json({
      success: false,
    });
  }
};

const updateResturant = async (req, res) => {
  const id = req.params.id;
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
    let updatedData = await resturantModel.findByIdAndUpdate(
      req.params.id,
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

    res.status(200).send({ msg: "succesfull", updatedData });
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
    const resturent = await resturantModel.findByIdAndUpdate(
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
    const categories = await resturantModel.find({ deleteStatus: false });
    // console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getAllResturants,
  createResturant,
  updateResturant,
  deleteResturent,
};
