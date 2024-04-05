const express = require("express");
const {
    createOrderForTable,
    updateOrder,
    deleteOrder,
    readOrder,
} =  require('../controller/orderController');


const {

    createCartForOnside,
    getCart,
    Add_To_Cart_Onsite_order,
    deletePreviousCart,
    Add_To_Cart_Offsite_order
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






//User Management
// router.post("/create-new-user-by-sign-up",signUp);
// router.post("/sign-in",signIn);
router.post("/user-jwt",JWTtoken);
router.delete("/sign-out-user",signout);
router.get('/get-profile/:email',getProfile);

router.post("/user-profile-update-address/:email",updateProfileAddress);
router.patch("/edit-my-profile/:email",updateProfile);



//cart
router.get("/get-my-cart/:email",getCart);  //get cart for user
router.delete("/delete-my-previous-carts/:email",deletePreviousCart) //delete exisiting cart data
router.post("/add-to-cart-onsite/:email",Add_To_Cart_Onsite_order)  //onsite add to cart function
router.post("/add-to-cart-offsite/:email",Add_To_Cart_Offsite_order)  //offsite add to cart function

module.exports=router;