const express = require("express");
const {
    createOrderForTable,
    updateOrder,
    deleteOrder,
    readOrder,
} =  require('../controller/orderController');


const {
    createCartForTable,
    updateCart,
    deleteCart,
    readCart
  }  = require('../controller/cartController')

const router = express.Router();


//Route  for creating a new cart for table with id :tableId
router.post("/user/cart",createCartForTable);

//Route for create order