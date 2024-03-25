const vendor = require("../model/vendorModel");
const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const { res_id, branchID } = req.params;
    await Customer({
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
