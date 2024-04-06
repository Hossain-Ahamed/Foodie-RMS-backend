const Cart = require("../model/cartModel");
const dishesModel = require("../model/dishesModel");
const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");

const Add_To_Cart_Onsite_order = async (req, res) => {
  try {
    const {
      res_id,
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
    } = req.body;
    const { email } = req.params;
    const checkUser = await userModel.findOne({ email: email });

    if (!checkUser) {
      return res.status(401).send("Invalid User");
    }

    await Cart.deleteMany({
      user_id: checkUser?._id,
      branchID: { $ne: branchID },
    });

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
    const saveCart = await new Cart({
      res_id,
      branchID,
      user_id: checkUser._id,
      dish_id,
      addOn,
      options,
      totalPrice,
      order_from,
      extraPrice: extra,
      VAT,
      totalPrice: totalPrice * quantity,
      basePrice,
      quantity,
      order_from: "ONSITE",
      img,
    }).save();
    res.status(200).send(saveCart);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const Add_To_Cart_Offsite_order = async (req, res) => {
  try {
    const {
      res_id,
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
    } = req.body;
    const { email } = req.params;
    const checkUser = await userModel.findOne({ email: email });

    if (!checkUser) {
      return res.status(401).send("Invalid User");
    }

    await Cart.deleteMany({
      user_id: checkUser?._id,
      branchID: { $ne: branchID },
    });

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
    const saveCart = await new Cart({
      res_id,
      branchID,
      user_id: checkUser._id,
      dish_id,
      addOn,
      options,
      totalPrice,
      order_from,
      extraPrice: extra,
      VAT,
      totalPrice: totalPrice * quantity,
      basePrice,
      quantity,
      order_from: "OFFSITE",
      img,
    }).save();
    res.status(200).send(saveCart);
  } catch (error) {
    responseError(res, 500, error);
  }
};


const getCart = async (req, res) => {
  try {
    const { email } = req.params;
    const checkUser = await userModel.findOne({ email: email });
    if (!checkUser) {
      responseError(res, 401, "User not found");
    }
    const getCarts = await Cart.find({ user_id: checkUser._id });

    // Map through each cart item and fetch dish_data
    const dishDataPromises = getCarts.map(async (cartItem, index) => {
      const dishData = await dishesModel
        .findById(cartItem.dish_id)
        .select("title img");

      // Check if dishData is null, if so, delete the corresponding cart item
      if (!dishData) {
        console.log(
          `Dish not found for cart item at index ${index}. Deleting...`
        );
        await Cart.findByIdAndDelete(cartItem._id);
        return null; // Returning null if dishData is not found
      }

      return { ...cartItem.toObject(), 
        dishId: dishData._id,
        title: dishData.title,
      }; // Merge cartItem and dishData
    });

    // Wait for all promises to resolve
    const allDishDataWithCarts = await Promise.all(dishDataPromises);

    // console.log(allDishDataWithCarts); // This will contain merged properties of getCarts and dish_data for each cart item

    const validDishDataWithCarts = allDishDataWithCarts.filter(
      (item) => item !== null
    );
    res.status(200).send(validDishDataWithCarts);
  } catch (error) {
    responseError(res, 500);
  }
};

const deleteSingleCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const deleteCart = await Cart.deleteOne({ _id: cartId });
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    responseError(res, 500);
  }
};

const deletePreviousCart = async (req, res) => {
  try {
    const { email } = req.params;
    const checkUser = await userModel.findOne({ email: email });

    if (!checkUser) {
      return res.status(401).send("Invalid User");
    }

   const data=  await Cart.deleteMany({
      user_id: checkUser?._id,
    });

    res.status(200).send("Deleted Successfully");
  } catch (error) {
    console.log(error)
    responseError(res, 500);
  }
};

const getCartforSingle = async (req, res) => {
  try {
    const {_id}= req.params;
    const checkCart = await  Cart.findOne({_id : _id });
    if(checkCart){
      const getDish = await dishesModel.findOne({_id: checkCart?.dish_id});
      
      if(!getDish){
        responseError(res, 404);
        return;
      }else{
        res.status(200).send({dish : getDish,selectedItemCartData : checkCart});
      }
    }else{
      responseError(res, 404);
      return;
    }
  } catch (error) {
    responseError(res, 500);
  }
};

const updateSingleCart = async (req,res) =>{
  try {
    const {_id,email} = req.params;
    // console.log(req.body)
    const {dish_id,
      name,
      addOn,
      options,
      quantity,
      order_from,
      extra,
      VAT,
      totalPrice,
      basePrice
    }= req.body
    let cartData =await Cart.findById( _id );
    
    if (!cartData) {
      responseError(res, 404,"No Data Found!");
      return;
    }else{
      const checkUser = await userModel.findOne({email:email});
      if (!checkUser._id.equals(cartData.user_id)){
         responseError(res, 401,'You are not Authorized to perform this action');
         return ;
      }
      //update dishes in the cart
      const updateCart = await Cart.findByIdAndUpdate(cartData._id ,{dish_id,
        addOn,
        options,
        quantity,
        order_from,
        extra,
        VAT,
        totalPrice,
        basePrice
      })

      res.status(200).send(true);
      

    }
  } catch (error) {
    responseError(res, 500);
  }
}

module.exports = {
  Add_To_Cart_Onsite_order,
  Add_To_Cart_Offsite_order,
  deleteSingleCart,
  deletePreviousCart,
  getCart,
  getCartforSingle,
  updateSingleCart,
};
