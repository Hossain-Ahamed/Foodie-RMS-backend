const subscriptionPackagesModel = require("../model/subcripstionPackages");

const getAllSubscriptionPackage = async (req, res) => {
  try {
    const data = await subscriptionPackagesModel.find();
    res.status(200).send(data);
  } catch (e) {
    console.log("Error in getting all Subscription Packages", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addNewSubscriptionPackage = async (req, res) => {
  const { packageType, shortDescription, finalPrice, cutPrice, duration } =
    req.body;
  if (!packageType || !shortDescription || !finalPrice || !cutPrice) {
    return res.status(400).json({ error: "Please provide complete details." });
  } else {
    let packageExist = await subscriptionPackagesModel.findOne({
      packageType: packageType,
    });
    if (packageExist) {
      return res.status(409).json({ error: "This Package is already exist." });
    } else {
      const newPackage = new subscriptionPackagesModel({
        packageType: packageType,
        shortDescription: shortDescription,
        finalPrice: finalPrice,
        cutPrice: cutPrice,
        duration: duration,
      });
      try {
        const savePackage = await newPackage.save();
        res.status(201).send(savePackage);
      } catch (e) {
        console.log("Error in adding New Subscription Package", e);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
};
const updateSubscriptionPackage = async (req, res) => {
  try {
    const id = req.params._id;
    const { packageType, shortDescription, finalPrice, cutPrice, duration } =
      req.body;
    const updatedPackage = await subscriptionPackagesModel
      .findByIdAndUpdate(
        id,
        {
          packageType: packageType ? packageType : null,
          shortDescription: shortDescription ? shortDescription : null,
          finalPrice: finalPrice ? finalPrice : null,
          cutPrice: cutPrice ? cutPrice : null,
          duration: duration ? duration : null,
        },
        { new: true }
      )
      .exec(); // the updated document not the original one
    res.status(200).send(updatedPackage);
  } catch (e) {
    res.status(400).json({ error: "Bad Request" });
  }
};

const deleteSubscriptionPackage = async (req, res) => {
  try {
    const { _id } = req.params;
    if (_id) {
      await subscriptionPackagesModel.findByIdAndDelete({ _id: _id });
      return res.status(200).send(true);
    }
  } catch {
    res.status(500).send(false);
  }
};

const giveOldSubscriptionData = async (req, res) => {
  try {
    const { _id } = req.params;
    if (_id) {
      const data = await subscriptionPackagesModel.findById(_id);
      return res.status(200).send(data);
    }
  } catch {
    res.status(500).send(false);
  }
};

module.exports = {
  getAllSubscriptionPackage,
  addNewSubscriptionPackage,
  updateSubscriptionPackage,
  deleteSubscriptionPackage,
  giveOldSubscriptionData,
};
