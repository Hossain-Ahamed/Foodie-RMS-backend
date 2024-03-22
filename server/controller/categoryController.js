const categoryModel = require("../model/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const { title, img, description } = req.body;
    if (!title) {
      return res.status(400).json({ msg: "Please fill all fields" });
    } else {
      let catExist = await categoryModel.findOne({
        title: title,
        branchID: branchID,
      });
      if (catExist) {
        return res.status(409).json({ msg: `${title} already exists` });
      } else {
        const newCat = new categoryModel({
          res_id,
          branchID,
          title,
          img,
          description,
        });
        const result = await newCat.save();
        // console.log(result);
        res.status(201).json(result);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const allCategory = async (req, res) => {
  try {
    const { branchID } = req.params;
    const { currentPage, dataSize, status } = req.query;
    const skip = (parseInt(currentPage)) * parseInt(dataSize);
    let categories;
    let totalCount;
    if (status === "all") {
      categories = await categoryModel
        .find({
          deleteStatus: false,
          branchID: branchID,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
      });
    } else if (status === "active") {
      categories = await categoryModel
        .find({
          deleteStatus: false,
          branchID: branchID,
          active: true,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
        active: true,
      });
    } else if (status === "inactive") {
      categories = await categoryModel
        .find({
          deleteStatus: false,
          branchID: branchID,
          active: false,
        })
        .skip(skip)
        .limit(parseInt(dataSize));
      totalCount = await categoryModel.countDocuments({
        deleteStatus: false,
        branchID: branchID,
        active: false,
      });
    }

    console.log(categories);
    res.status(200).json({
      categories,
      currentPage: parseInt(currentPage),
      dataSize: parseInt(dataSize),
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

// Read operation
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById({
      _id: categoryId,
      deleteStatus: false,
    });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update operation
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { res_id, branchID, title, img, description } = req.body;

    const category = await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        res_id,
        branchID,
        title,
        img,
        description,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete operation
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        deleteStatus: true,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json({ msg: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addCategory,
  allCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
