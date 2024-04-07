const membership = require("../model/membershipModel");
const User = require("../model/userModel");

const getMembershipDetailsById = async (req, res) => {
  try {
    const { res_id } = req.params;
    let data = await membership.findOne({ res_id: res_id });
    if (data) {
      return res.status(200).send(data);
    } else {
      let data = await membership({
        res_id,
      }).save();
      
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const searchMember = async(req,res)=>{
  try {
    const {res_id} = req.params;
    const {phone} = req.query;
    if(!phone){
      res.status(400).send(false);
    }
    const regexPattern = new RegExp(phone,'i');
    const users = await User.find({phone:{$regex : regexPattern}});
    if(!users){
      res.status(404).send(false);
    }
    res.status(200).send(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
    await membership.findOneAndUpdate(
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
  searchMember
};
