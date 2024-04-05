const express = require("express");
const {
    createOrderForTable,
    updateOrder,
    deleteOrder,
    readOrder,
} =  require('../controller/orderController');


const {

    createCartForOnside,
    getCart
  }  = require('../controller/cartController')

const {getAllSubscriptionPackage,addNewSubscriptionPackage,updateSubscriptionPackage} = require("../controller/subscriptionPackagesController");
const { employeeLogin } = require("../controller/employeeController");
const { getRestaurantBranchDetailsWithCategoryAndDishes } = require("../controller/dishesControllers");
const { getAllRestaurantOf_A_City } = require("../controller/branchController");
const { signUp, signIn, JWTtoken, signout, getProfile, updateProfileAddress, updateProfile } = require("../controller/userController");

const router = express.Router();


//Route  for creating a new cart for table with id :tableId
router.get("/subscription-packages",getAllSubscriptionPackage);



router.post("/rms-employee-jwt",employeeLogin);

//Route for create order



router.get("/restaurant/:res_id/branch/:branchID/single-restaurant-all-data",getRestaurantBranchDetailsWithCategoryAndDishes); //all data for a single restaurant

router.get('/all-restaurant/city/:city',getAllRestaurantOf_A_City) //get all restaurant of a city



//Onsite Management
router.post("/add-to-cart-onsite",createCartForOnside);
router.get("/get-my-cart/:email",getCart);


//User Management
// router.post("/create-new-user-by-sign-up",signUp);
// router.post("/sign-in",signIn);
router.post("/user-jwt",JWTtoken);
router.delete("/sign-out-user",signout);
router.get('/get-profile/:email',getProfile);

router.post("/user-profile-update-address/:email",updateProfileAddress);
router.patch("/edit-my-profile/:email",updateProfile);



module.exports=router;