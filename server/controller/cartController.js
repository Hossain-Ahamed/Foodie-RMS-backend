const Cart = require("../model/cartModel");
const dishesModel = require("../model/dishesModel");
const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");

const createCartForOnside = async (req,res)=>{
  try {
    const {res_id,
      branchID,
      dish_id,
      name,
      addOn,
      options,
      quantity,
      order_from,
      extra,
      VAT,
      totalPrice,
      basePrice,
      img,
    email} =  req.body;

    await Cart.deleteMany({ branchID: { $ne:  branchID} }) 

    const checkUser = await userModel.findOne({email:email})
    if(!checkUser){
        return res.status(401).send('Invalid User')
    }
    const checkDish = await dishesModel.findById(dish_id);
    if (!checkDish) {
      throw new Error("This Dish is not available!");
    }
    // let addOns = checkDish.addOn || [];
    // if (addOn.length > 0) {
    //   // Calculate the total price of the add-ons provided in the dish data
    //   const addOnTotalPrice = addOns.reduce((acc, addon) => {
    //     if()
    //     const addonPrice = addonPrices[addon]; // Get the price of the addon from the predefined mapping
    //     return acc + (addonPrice || 0); // Add the price to the total, if it exists
    //   }, 0);
    //   totalPrice += addOnTotalPrice;
    // }

    // let extraPrice = 
    const saveCart = await new Cart ({res_id,
      branchID,
      user_id: checkUser._id,
      dish_id,
      addOn,
      options,
      totalPrice,
      order_from,
      extraPrice:extra,
      VAT,
      totalPrice : totalPrice*quantity,
      basePrice,
      order_from:"ONSITE",
    img}).save();
    res.status(200).send(saveCart);

  } catch (error) {
    responseError(res,500, error);
  }
}

const getCart = async (req,res)=>{
  try {
    const {email}= req.params;
    const checkUser =  await userModel.findOne({ email:email });
    if (!checkUser){
      responseError(res,401,"User not found");
    }
    const getCarts= await Cart.find({user_id:checkUser._id});
    res.status(200).send(getCarts)
    //TODO get cart er somoy dish er sathe dish id check korbo valid ase kina

  } catch (error) {
    responseError(res,500);
  }
}

const deleteCart = async (req,res) =>{
  try {
    const {cartId} = req.params;
    const deleteCart =  await Cart.deleteOne({ _id: cartId });
    res.status(200).json("Deleted Successfully");
    
  } catch (error) {
    responseError(res,500);
  }

}

module.exports = {
  createCartForOnside,
  deleteCart,
  getCart,
}