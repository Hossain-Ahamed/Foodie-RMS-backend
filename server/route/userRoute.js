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

const {getAllSubscriptionPackage,addNewSubscriptionPackage,updateSubscriptionPackage} = require("../controller/subscriptionPackagesController");
const { employeeLogin } = require("../controller/employeeController");
const { getRestaurantBranchDetailsWithCategoryAndDishes } = require("../controller/dishesControllers");

const router = express.Router();


//Route  for creating a new cart for table with id :tableId
router.post("/user/cart",createCartForTable);

router.get("/subscription-packages",getAllSubscriptionPackage);



router.post("/rms-employee-jwt",employeeLogin);

//Route for create order



router.get(
  "/restaurant/:res_id/branch/:branchID/category/dishes",
  getRestaurantBranchDetailsWithCategoryAndDishes
);


module.exports=router;