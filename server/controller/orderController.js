const Order = require('../model/orderModel');
const Cart = require('../model/cartModel');
const Table = require('../model/tableModel');
const Dish = require('../model/dishesModel');
const cartModel = require('../model/cartModel');
const membershipModel = require('../model/membershipModel');
const userModel = require('../model/userModel');
const { responseError } = require('../utils/utility');

const createOrderForOffsite = async (req, res) => {
   
};
const getOrderDetailsBeforeCheckout = async (req, res) => {
   try {
    const { email, branchID,res_id } = req.params;

    const checkUser = await userModel.findOne({email : email});
    if(!checkUser){
        return res.status(401).json("Invalid User"); 
    };
    const checkCart = await cartModel.find({branchID : branchID , user_id : checkUser._id});

    const dishDataPromises = checkCart.map(async (cartItem, index) => {
      const dishData = await Dish
        .findById(cartItem.dish_id)
        .select("title img");

      // Check if dishData is null, if so, delete the corresponding cart item
      if (!dishData) {
        console.log(
          `Dish not found for cart item at index ${index}. Deleting...`
        );
        await cartModel.findByIdAndDelete(cartItem._id);
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


    const deleteCart = await cartModel.deleteMany({ user_id : checkUser._id, branchID: { $ne: branchID } }).exec();// Delete the user
    // Calculate the total price for all items
    let totalPrice = 0;
    for (const item of validDishDataWithCarts) {
      totalPrice += item.totalPrice;
    }
    const checkMembership = await membershipModel.findOne({ 
      res_id: res_id,
      'memberShip': { $elemMatch: { $eq: checkUser._id } } 
    });


    let discount;
    if(checkMembership){
      discount=((checkMembership.percentageOffer)/100)*totalPrice;
      if(discount > checkMembership.MaximumLimit_in_TK){
        discount =  checkMembership.MaximumLimit_in_TK ;
      }
      // totalPrice -= discount;
    }else{
       discount=0;
    }

 
    

    res.status(200).send({
      dishes : validDishDataWithCarts, 
      subtotal : parseFloat(totalPrice.toFixed(2)), 
      discount : parseFloat(discount.toFixed(2)), 
      total : parseFloat((totalPrice - discount).toFixed(2)),
    })


   } catch (error) {
    responseError(res, 500,error);
   }
};


const updateOrder = async (req, res) => {
  
  };
  
const readOrder = async (req, res) => {
    
  };
  
const deleteOrder = async (req, res) => {
    
  };
  

module.exports = {
  getOrderDetailsBeforeCheckout,
    updateOrder,
    deleteOrder,
    readOrder,
};
