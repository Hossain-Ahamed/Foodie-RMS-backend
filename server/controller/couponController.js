const Coupon = require("../model/couponModel");

const createCoupon = async (req, res) => {
  try {
    const {
      name,
      percentage,
      minimumOrderAmount,
      maximumDiscountLimit,
      maximumNumberOfUse,
      from,
      to,
    } = req.body;
    const { res_id, branchID } = req.params;
    const newCoupon = await Coupon({
      res_id,
      branchID,
      name,
      percentage,
      minimumOrderAmount,
      maximumDiscountLimit,
      maximumNumberOfUse,
      from,
      to,
    }).save();
    res.status(201).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const { branchID } = req.params;
    const coupons = await Coupon.find({ branchID: branchID });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(_id);
    res.status(200).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
};
