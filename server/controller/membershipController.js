const membership = require("../model/membershipModel");

const getMembershipDetailsById = async (req, res) => {
  try {
    const { res_id } = req.params;
    if (res_id) {
      let data = await membership.findOne({ res_id: res_id });
      return res.status(200).send(data);
    } else {
      const { res_id } = req.params;
      await membership({
        res_id,
      }).save();
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMembership = async (req, res) => {
  try {
    const { res_id } = req.params;
    const {
      rules,
      MaximumLimit_in_TK,
      percentageOffer,
      MinimumOrderAmountTillNow,
      singleTimeMinimumOrderAmount,
    } = req.body;
    await vendor.findOneAndUpdate(
      { res_id: res_id },
      {
        $set: {
          rules,
          MaximumLimit_in_TK,
          percentageOffer,
          MinimumOrderAmountTillNow,
          singleTimeMinimumOrderAmount,
        },
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  updateMembership,
  getMembershipDetailsById,
};
