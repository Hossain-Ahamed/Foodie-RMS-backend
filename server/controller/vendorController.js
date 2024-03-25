const vendor = require("../model/vendorModel");
const createVendor = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const { res_id, branchID } = req.params;
    await vendor({
      res_id,
      branchID,
      name,
      phone,
      address,
    }).save();
    res.status(201).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const { branchID } = req.params;
    const vendors = await vendor.find({ branchID: branchID });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, phone, address } = req.body;
    await vendor.findByIdAndUpdate(
      _id,
      { name, phone, address },
      { new: true }
    );
    res.status(200).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { _id } = req.params;
    await vendor.findByIdAndDelete(_id);
    res.status(200).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
};
