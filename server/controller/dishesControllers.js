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
    const titles = categories.map((category) => category.title);

    res.status(200).json({
      titles,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getDishById = async (req, res) => {
  try {
    const { dishID } = req.params;
    console.log(dishID)
    const dish = await dishesModel.findById({
      _id: dishID,
      deleteStatus: false,
    });
    console.log(dish)
    res.status(200).json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//grt all dishes

const getDishesByBranchId = async (req, res) => {
  try {
    const { branchID } = req.params;
    const { currentPage, dataSize, status } = req.query;
    const skip = parseInt(currentPage) * parseInt(dataSize);
    let dishes;
    let totalCount;
    if (status === "all") {
      dishes = await dishesModel
        .find({
          branchID: branchID,
          deleteStatus: false,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
      });
    } else if (status === "active") {
      dishes = await dishesModel
        .find({
          branchID: branchID,
          deleteStatus: false,
          isActive: true,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
        isActive: true,
      });
    } else if (status === "inactive") {
      dishes = await dishesModel
        .find({
          branchID: branchID,
          deleteStatus: false,
          isActive: false,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
        isActive: false,
      });
    }
    res.status(200).json({
      dishes,
      currentPage: parseInt(currentPage),
      dataSize: parseInt(dataSize),
      totalCount,
    });
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
    const { dishId } = req.params;
    // if (!dishesModel.findOne({ title })) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Dish Doesn't Exists",
    //   });
    // }
    const dish = await dishesModel.findByIdAndUpdate(
      dishId,
      {
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
    res.status(200).send(true);
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
  getDishById,
};
