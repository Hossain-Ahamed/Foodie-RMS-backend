const dishesModel = require("../model/dishesModel.js");
const categoryModel = require("../model/categoryModel");

// create dishes

const createDishes = async (req, res) => {
  try {
    const {
      title,
      category,
      active,
      description,
      supplementary_duty,
      img,
      price,
      preparation_cost,
      offerPrice,
      sales_tax,
      options,
      addOn,
    } = req.body;
    const { res_id, branchID } = req.params;
    // if (dishesModel.findOne({ title:title, branchID:branchID })) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Dish Already Exists",
    //   });
    // }

    const dish = await new dishesModel({
      res_id,
      branchID,
      title,
      category,
      active,
      description,
      supplementary_duty,
      img,
      price,
      preparation_cost,
      offerPrice,
      sales_tax,
      options,
      addOn,
    }).save();
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(400).send(false);
  }
};

//send category name
const getAllCategoryTitles = async (req, res) => {
  try {
    const { branchID } = req.params;
    const categories = await categoryModel.find({
      deleteStatus: false,
      branchID: branchID,
    });
    if (!titles) {
      return res.status(404).json("No category Found");
    }
    const titles = categories.map((category) => category.title);

    res.status(200).json({
      titles,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//grt all dishes

const getDishesByBranchId = async (req, res) => {
  try {
    const { branchID } = req.params;
    const dishes = await dishesModel
      .find({
        branchID: branchID,
        deleteStatus: false,
      })
      .select(
        "title,category,active,preparation_cost,price,supplementary_duty,sales_tax,offerPrice"
      );
    if (!dishes) {
      return res.status(404).json("No Dish Found");
    }
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//update dishes
const updateDish = async (req, res) => {
  try {
    const {
      res_id,
      branchID,
      title,
      category,
      isActive,
      description,
      supplementary_duty,
      img,
      price,
      preparation_cost,
      offerPrice,
      sales_tax,
      options,
      addOn,
    } = req.body;
    const _id = req.params._id;
    // if (!dishesModel.findOne({ title })) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Dish Doesn't Exists",
    //   });
    // }
    const dish = await dishesModel.findByIdAndUpdate(
      _id,
      {
        res_id,
        branchID,
        title,
        category,
        isActive,
        description,
        supplementary_duty,
        img,
        price,
        preparation_cost,
        offerPrice,
        sales_tax,
        options,
        addOn,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(false);
  }
};

//delete dish
const deleteDish = async (req, res) => {
  try {
    const _id = req.params._id;
    await dishesModel.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
    res.satus(200).send(true);
  } catch (err) {
    res.status(400).send(false);
  }
};

module.exports = {
  createDishes,
  updateDish,
  deleteDish,
  getAllCategoryTitles,
  getDishesByBranchId,
};
