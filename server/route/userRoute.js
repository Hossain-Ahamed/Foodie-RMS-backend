const express = require("express");
const {
    createOrderForTable,
    updateOrder,
    deleteOrder,
    readOrder,
    getOrderDetailsBeforeCheckout,
    createOrderForOnsite,
    onGoingOrderForOnSite,
    allCompleteOrderForOnSite,
    getOrderDetailsBeforeCheckoutForOffsite,
    getDiscountByCoupon,
    createOrderForOffsite,
    allOrderListForUser,
} =  require('../controller/orderController');


const {

    createCartForOnside,
    getCart,
    Add_To_Cart_Onsite_order,
    deletePreviousCart,
    Add_To_Cart_Offsite_order,
    getCartforSingle,
    deleteSingleCart,
    updateSingleCart
  }  = require('../controller/cartController')

const {getAllSubscriptionPackage,addNewSubscriptionPackage,updateSubscriptionPackage} = require("../controller/subscriptionPackagesController");
const { employeeLogin } = require("../controller/employeeController");
const { getRestaurantBranchDetailsWithCategoryAndDishes } = require("../controller/dishesControllers");
const { getAllRestaurantOf_A_City, checkBusinessHours } = require("../controller/branchController");
const { signUp, signIn, JWTtoken, signout, getProfile, updateProfileAddress, updateProfile, viewMemberShipForUser, ReqForOTP, verifyOTP, resetPassword } = require("../controller/userController");
const { deleteMembership } = require("../controller/membershipController");

const router = express.Router();


//Route  for creating a new cart for table with id :tableId
router.get("/subscription-packages",getAllSubscriptionPackage);



router.post("/rms-employee-jwt",employeeLogin);

//Route for create order



router.get("/restaurant/:res_id/branch/:branchID/single-restaurant-all-data",getRestaurantBranchDetailsWithCategoryAndDishes); //all data for a single restaurant

router.get('/city/:city',getAllRestaurantOf_A_City) //get all restaurant of a city




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
router.get("/get-cart-data-detail-for-edit/:email/cartID/:_id",getCartforSingle) // get dish data & cart data for edit 
router.delete("/delete-cart-item/:email/cart-id/:cartId",deleteSingleCart) //delete a cart item
router.patch("/update-cart-item-onsite/:email/:_id",updateSingleCart) //update a cart item

router.get("/restuarant/:res_id/branch/:branchID/email/:email",getOrderDetailsBeforeCheckout);


//order Route
router.post("/create-an-onsite-order/:email", createOrderForOnsite) ;   //create onsite order
router.get("/ongoing-order/restaurant/:res_id/branch/:branchID/email/:email", onGoingOrderForOnSite);    //user end
router.post("/create-an-offsite-order/:email", createOrderForOffsite) ;   //create offsite order

router.get("/get-all-pricing-detail-before-offsite-order-checkout/:email/type/:type",getOrderDetailsBeforeCheckoutForOffsite);
router.get("/offsite-order-taking-place-check/:res_id/:branchID",checkBusinessHours)

// coupon 
router.post("/get-discount-by-applying-coupon",getDiscountByCoupon) //get discount by applying coupon for user

//Membership Manage
router.delete("/delete-membership/:res_id/:_id",deleteMembership);

router.get('/get-my-membership/:email',viewMemberShipForUser)



/***
 * 
 * --------------------------------------------------------------------
 *            Order List For User 
 */
router.get("/all-order-list-user/:email",allOrderListForUser)
router.get("/recent-orders/restaurant/:res_id/branch/:branchID/email/:email", allCompleteOrderForOnSite);    //user end
router.get("/ongoing-orders/restaurant/:res_id/branch/:branchID/email/:email", onGoingOrderForOnSite);    //user end

// -----------------------------------------------------------------------------------------

// forget pass 
router.get("/req-for-otp/:email",ReqForOTP);
router.post("/verify-otp",verifyOTP);
router.post("/change-password",resetPassword);

module.exports=router;