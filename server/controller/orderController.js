const Order = require('../model/orderModel');
const Cart = require('../model/cartModel');
const Table = require('../model/tableModel');
const Dish = require('../model/dishesModel');
const cartModel = require('../model/cartModel');
const membershipModel = require('../model/membershipModel');
const userModel = require('../model/userModel');

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
    const deleteCart = await cartModel.deleteMany({ user_id : checkUser._id, branchID: { $ne: branchID } }).exec();// Delete the user
    // Calculate the total price for all items
    let totalPrice = 0;
    for (const item of checkCart) {
      totalPrice += item.totalPrice;
    }
    const checkMembership = await membershipModel.findOne({ 
      res_id: res_id,
      'memberShip': { $elemMatch: { $eq: checkUser._id } } 
    });
    var discount;
    if(checkMembership){
      discount=((checkMembership.percentageOffer)/100)*totalPrice;
      if(discount > checkMembership.MaximumLimit_in_TK){
        discount =  checkMembership.MaximumLimit_in_TK ;
      }
      totalPrice -= discount;
    }else{
       discount=0;
    }

    res.status(200).send({checkCart, totalPrice, discount, percentage: checkMembership.percentageOffer})


   } catch (error) {
    responseError(res, 500);
   }
};


const updateOrder = async (req, res) => {
  
  };
  
const readOrder = async (req, res) => {
    
  };
  
const deleteOrder = async (req, res) => {
    
  };
  

module.exports = {
    createOrderForOffsite,
    updateOrder,
    deleteOrder,
    readOrder,
    getOrderDetailsBeforeCheckout
};
