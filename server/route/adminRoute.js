const express = require("express");
const router = express.Router();
const {
  allEmployee,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  SearchEmployee,
  allEmployeeForRestaurent,
  allEmployeeForBranch,
  employeeRole,
  addExistingEmployee,
  getEmployeeData_ByID_ForCurrentEmployeeEdit,
  getAllBranch_And_ResturantData,
  allBranchesOfSuperAdmin,
  allDeliveryBoyForBranch,
  assignDeliveryPartnerForOffsiteOrder,
  // createUAccount,
} = require("../controller/employeeController");

const {
  addCategory,
  allCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const {
  createDishes,
  updateDish,
  deleteDish,
  getAllCategoryTitles,
  getDishesByBranchId,
  getDishById,
  get_All_Dish_Name_For_restaurant_For_Admin,
} = require("../controller/dishesControllers");

const {
  createBranch,
  updateBranch,
  deleteBranch,
  getAllBranch,
  getAllBranchForDev,
  singleBranchDataForDev,
  showBusinessHours,
  modifyBusinessHours,
  showPaymentType,
  modifyPaymentType,
  getBranchesTable,
  addTables,
  barnchTableDelete,
  getBranchDetail,
} = require("../controller/branchController");

const {
  getAllResturantsForDev,
  getAllResturants,
  createResturant,
  updateResturant,
  deleteResturent,
  sendRestaurantData,
  // createAccount,
} = require("../controller/restaurantController");

const {
  createSubscription,
  extendSubscription,
  CreatePaymentIntent,
  getPaymentDetails,
  updatePackageAfterPayment,
  getSubscriptionPurchaseHistory,
  subscription_Duration_For_All_Branches,
  getPaymentDetailsForExtendAndAddBranch,
  updatePackageAfterPaymentForNewBranch,
} = require("../controller/subscriptionController");

const {
  deleteBranchFromDevPaymentList,
  deactivateBranchFromDevPaymentList,
  notifyOwnerFromDev,
} = require("../controller/devSubscriptionsEdit");

const {
  createExpense,
  showAllExpense,
  deleteExpense,
  updateExpense,
  getExpenseById,
  purchaseHistory,
  vendorAndEmployeeNameInDropdown,
} = require("../controller/expenseController");
const {
  CreateDev,
  devFindByUID,
  getDevProfile,
  getAllDev,
  deleteDevAccount,
  devLogIn,
} = require("../controller/devController");

const {
  getAllSubscriptionPackage,
  addNewSubscriptionPackage,
  updateSubscriptionPackage,
  deleteSubscriptionPackage,
  giveOldSubscriptionData,
} = require("../controller/subscriptionPackagesController");
const {
  getPrintingSetUp,
  showPrintingSetUp,
} = require("../controller/printingSetUpController");

const {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../controller/couponController");
const {
  deleteVendor,
  updateVendor,
  getAllVendors,
  createVendor,
  getVendorById,
} = require("../controller/vendorController");
const {
  getMembershipDetailsById,
  updateMembership,
  searchMember,
  getMembershipUserData,
  addNewMembership,
  deleteMembership,
} = require("../controller/membershipController");

const {
  createStories,
  deleteStoryByID,
  allStoriesByBranch,
} = require("../controller/storiesControlle");
const { deleteExpiredStories } = require("../middleware/expiredStories");

const {
  createVideo,
  deleteVideoById,
  getStoriesByBranchID,
} = require("../controller/shortVideoController");

//inventory and resipe
const {
  addNewItemToInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByBranchId,
  giveVendorName,
  oldDataOfItem,
} = require("../controller/inventoryController");
const { dishName, createRecipe } = require("../controller/recipeController");
const { searchUserByPhone } = require("../controller/userController");



const {
  adminPlaceOrder,
  OngoingOrderList,
  dataForPayment,
  updateOrderByIdForPayment,
  UpdateOrder_ReceivedMoney_PayFirst_branches_Onsite_Order,
  approveDishItem,
  UpdateOrder_ReceivedMoney_PayLast_branches_Onsite_Order,
  deleteOrder,
  AllOrderList,
  ProcessingOrderListForKitchenStaff,
  order_Is_being_Prepared_By_KOT_Approval,
  order_Prepared_and_ready_to_serve_By_KOT_Approval,
  Onsite_Order_Update_Status_for_completed,
  AllOrderList_For_DeliveryPartner,
  handleProceedTOReadyToDelivery,
  verifyOtpAndCompleteOrder,
} = require("../controller/orderController");

// http://localhost:5000/admin/login

//create videos
router.post(
  "/admin/restaurant/:res_id/branch/:branchID/create-reels",
  createVideo
);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/all-reels",
  getStoriesByBranchID
);

router.delete("", deleteVideoById);

//create stories
router.post(
  "/admin/restaurant/:res_id/branch/:branchID/create-stories",
  createStories
);
router.delete(
  "/admin/restaurant/:res_id/branch/:branchID/delete-stories/:_id",
  deleteStoryByID
);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/all-stories",
  deleteExpiredStories,
  allStoriesByBranch
);

//For create => Restricted  Route (Only for admin)
router.post("/create-restaurant", createResturant); // Create a new Restaurant in the database
router.post("/admin/restaurant/:res_id/create/branch", createBranch); // Create a new branch in the database
router.post(
  "/admin/restaurant/:res_id/branch/:branchID/add-category",
  addCategory
); // Add a new category to the list of categories
router.post("/admin/add-an-employee-to-the-system", addEmployee); // Create a new employee in the database
router.post("/admin/:res_id/add-new-dishes/:branchID", createDishes); //Create a new dish from the menu
router.post("/create-payment-intent", CreatePaymentIntent);
router.post("/admin/:res_id/branch/:branchID/create-coupons", createCoupon);
router.post("/admin/:res_id/branch/:branchID/create-vendors", createVendor);

router.get("/edit-restaurant/:_id", sendRestaurantData);
router.get("/admin/get-all-categories-name/:branchID", getAllCategoryTitles);
router.get("/admin/get-all-dishes/:branchID", getDishesByBranchId);
router.get("/admin/:res_id/branch/:branchID/get-all-vendors", getAllVendors);
router.get("/subscription-payment/:branchID", getPaymentDetails);
router.get(
  "/subscription-payment-for-extend-and-add-branch/:branchID",
  getPaymentDetailsForExtendAndAddBranch
);
router.get("/admin/:res_id/branch/:branchID/coupon-list", getAllCoupons);
router.get(
  "/admin/:res_id/branch/:branchID/get-single-vendor/:_id",
  getVendorById
);

// For Read => Public Route (Accessible for any admin)
router.get("/admin/read/restaurant", getAllResturants); // Get all available restaurant
router.get("/admin/:branchID/all-categories", allCategory); // Get all available Categories
router.get("/admin/read/employee", allEmployee); // Get all employees from the database
// router.get('/admin/read/dish', getDish);                  //Get All Dishes
router.get("/all-branch-payment-wise-list-for-dev-admins", getAllBranch);
// router.get("/subscription-packages", getAllSubscriptionPackage); //get all packages

//For ReadById =>  Private Route (Only for admin and super user)
router.get("/admin/get-categories/:id", getCategoryById); // Get Category by ID
router.get("/admin/:branchID/get-previous-dish/:dishID", getDishById);
router.get(
  "/restaurant/:res_id/existing-employee-data/:employeeId",
  getEmployeeById
); // Get Employee By Id

router.get(
  "/restaurant/:res_id/get-restaurant-name-and-all-branches",
  getAllBranch_And_ResturantData
); // get all branch and restaurant data
router.get(
  "/restaurant/:res_id/edit-employee-data/:employeeID",
  getEmployeeData_ByID_ForCurrentEmployeeEdit
); // Get Employee By Id for current employee
router.get("/restaurant/:res_id/membership-rules", getMembershipDetailsById);
router.post(
  "/add-an-employee-to-my-restaurant/:res_id/:branchID/employee/:employeeID",
  addExistingEmployee
);
router.post("/enlisted-payment", updatePackageAfterPayment);
router.post("/rms-enlist-payment", updatePackageAfterPaymentForNewBranch);

//For  Update => Admin or Super User Access (Admin can only update his own profile)
router.patch("/edit-restaurant/:_id", updateResturant);
router.patch("/admin/edit-categories/:id", updateCategory); //Update Category By ID
router.patch("/admin/update/employee/:id", updateEmployeeById); //Update Employee  By  ID for my current employee
router.patch("/admin/:branchID/edit-dishes/:dishID", updateDish); //Update The Dish By its id
router.patch("/admin/:res_id/branch/:branchID/edit-vendor/:_id", updateVendor);
//For Delete => Admin Only (No one else can delete an account)
router.delete("/admin/delete/restaurant/:id", deleteResturent); //Delete A restaurant By Its ID
router.delete(
  "/restaurant/:res_id/branch/:branchID/delete-branch",
  deleteBranch
); //Delete A branch By Its ID
router.delete("/admin/delete-categories/:id", deleteCategory); //Delete A Category By Its ID
router.delete("/admin/delete-dishes/:_id", deleteDish); //Delete a dish by its id
router.delete(
  "/admin/restaurant/:res_id/branch/:branchID/delete/employee/:id",
  deleteEmployeeById
); //Delete An Employee
router.delete(
  "/admin/:res_id/branch/:branchID/delete-coupon/:_id",
  deleteCoupon
);
router.delete(
  "/admin/:res_id/branch/:branchID/delete-vendor/:_id",
  deleteVendor
);
//subcription package for dev
router.get("/subscription-packages", getAllSubscriptionPackage); //get all packages
router.patch("/edit-subscription-packages/:_id", updateSubscriptionPackage);
router.delete("/delete-subscription-packages/:_id", deleteSubscriptionPackage);

router.post("/add-subscription-packages", addNewSubscriptionPackage);

//Subscription Route
// router.post("/admin/subscription", createSubscription);
// router.get("/admin/all-subscriptions",getAllSubscriptions);
router.post("/admin/extend-subscription/", extendSubscription);
router.patch("/payment-package/branch/:branchID", createSubscription);

//Create Account
// router.post("/admin/create/account/emplyoee", createUAccount);
// router.post("/admin/create/account/owner", createAccount);

//Search Employee
router.post("/search-employee-to-add", SearchEmployee);

//
router.get("/get-rms-employee-profile/:email", employeeRole);
router.get(
  "/all-branches-of-super-admin/:email/restaurant/:res_id",
  allBranchesOfSuperAdmin
);

//development side payment list
router.delete(
  "/delete-branch-from-payment-lists/:_id",
  deleteBranchFromDevPaymentList
);
router.patch(
  "/deactive-branch-from-payment-lists/:_id",
  deactivateBranchFromDevPaymentList
);
router.patch(
  "/notify-branch-owner-from-payment-lists/:_id",
  notifyOwnerFromDev
);
router.patch("/restaurant/:res_id/membership-rules", updateMembership);
router.get("/restaurant/:res_id/all-member-list", getMembershipUserData);
router.post("/restaurant/:res_id/add-new-member", addNewMembership);
router.delete("/restaurant/:res_id/userID/:_id", deleteMembership);
router.get("/restaurant/:res_id/memberSearch", searchMember);

//development side employee list
router.post("/dev/create", CreateDev);
router.get("/all-dev-profile", getAllDev);
router.get("/dev/:uid", devFindByUID);
router.get("/get-dev-profile/:email", getDevProfile);
router.delete("/delete-dev-profile/:_id", deleteDevAccount);

router.get("/restaurant/:res_id/all-employee-list", allEmployeeForRestaurent);
router.get(
  "/restaurant/:res_id/branch/:branchID/all-employee-list",
  allEmployeeForBranch
);
router.get("/all-restaurant-dev", getAllResturantsForDev);
router.get("/restaurant-all-branches/:res_id", getAllBranchForDev);
router.get("/restaurant/branch/:branchID", singleBranchDataForDev);

//Business Hours
router.get(
  "/restaurant/:res_id/branch/:branchID/manage-shift",
  showBusinessHours
); //show Business Hours
router.patch(
  "/restaurant/:res_id/branch/:branchID/manage-shift",
  modifyBusinessHours
); //modify Business Hours

//Payment Type of policy
router.get(
  "/restaurant/:res_id/branch/:branchID/payments-type",
  showPaymentType
); //show payment type
router.patch(
  "/restaurant/:res_id/branch/:branchID/payments-type",
  modifyPaymentType
); //modify payment type

//Expense Route
router.post("/admin/create/expense", createExpense);
router.get("/admin/all-expenses/:branchID", showAllExpense);
router.delete(
  "/admin/:res_id/branch/:branchID/delete-expenses/:_id",
  deleteExpense
);
router.get("/admin/all-purchase/:branchID", purchaseHistory);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/get-expenses",
  vendorAndEmployeeNameInDropdown
);
router.get("/admin/:res_id/branch/:branchID/get-expenses/:_id", getExpenseById);
router.patch(
  "/admin/:res_id/branch/:branchID/edit-expenses/:_id",
  updateExpense
);

//printing Setup
router.get(
  "/restaurant/:res_id/branch/:branchID/payment-slip-format",
  getPrintingSetUp
);
router.patch(
  "/restaurant/:res_id/branch/:branchID/payment-slip-format",
  showPrintingSetUp
);

//Tables
router.get("/restaurant/:res_id/branch/:branchID/tables", getBranchesTable);
router.post("/restaurant/:res_id/branch/:branchID/tables", addTables);
router.delete(
  "/restaurant/:res_id/branch/:branchID/tables/:number",
  barnchTableDelete
);

//login dev panel

router.post("/dev-admin-login", devLogIn);

// Subscription billing history data for supper admin
router.get(
  "/restaurant/:res_id/bill-history-list",
  getSubscriptionPurchaseHistory
);

// Subscription durations  supper admin
router.get(
  "/restaurant/:res_id/subscription-duration-of-all-branch",
  subscription_Duration_For_All_Branches
);

//get branch detail  and update   ///  super admin
router.get(
  "/restaurant/:res_id/branch/:branchID/get-branch-detail",
  getBranchDetail
); //get branch detail for edit
router.patch(
  "/restaurant/:res_id/branch/:branchID/get-branch-detail/edit",
  updateBranch
); // update branch data after edit

router.get(
  "/admin/restaurant/:res_id/branch/:branchID/get-dishes/:id",
  dishName
);

router.post(
  "/admin/restaurant/:res_id/branch/:branchID/add-new-dishes/:dishID",
  createRecipe
);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/get-vendors-for-inventory",
  giveVendorName
);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/inventory-report/",
  getInventoryByBranchId
);
router.post("/admin/add-to-inventory", addNewItemToInventory);
router.patch(
  "/admin/restaurant/:res_id/branch/:branchID/edit-inventory/:id",
  updateInventoryItem
);
router.delete(
  "/admin/:res_id/branch/:branchID/delete-inventory/:id",
  deleteInventoryItem
);
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/get-inventory-data/:id",
  oldDataOfItem
);

/**
 *                user payment gateway
 */
router.get("/pay-my-bill/:order_id", dataForPayment);
router.post("/pay-my-bill", updateOrderByIdForPayment);
// ----------------------------------------------------------------

/**
 *
 * -------------------------------------------------------------------------------
 *                    Order Management
 */
router.get(
  "/restaurant/:res_id/branch/:branchID/dishes-for-custom-order-for-admin",
  get_All_Dish_Name_For_restaurant_For_Admin
);

router.get("/search-user-by-phone", searchUserByPhone); //search user by phone for onsite place order by admin custom order

router.post(
  "/restaurant/:res_id/branch/:branchID/place-an-order-by-admin",
  adminPlaceOrder
); //admin place an order

router.get(
  "/admin/restaurant/:res_id/branch/:branchID/active-orders-list",
  OngoingOrderList
); //ongoing order list for admin
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/active-orders-list/kitchen-staff",
  ProcessingOrderListForKitchenStaff
); //ongoing order list for kitchen stuff
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/all-orders-list",
  AllOrderList
); //all order list for admin
router.get(
  "/admin/restaurant/:res_id/branch/:branchID/all-orders-list/delivery-boy/:_id",
  AllOrderList_For_DeliveryPartner
); //all order list for delivery partner

router.patch(
  "/update-an-onsite-pay-first-order-by-clicking-money-bag-by-admin/:orderID",
  UpdateOrder_ReceivedMoney_PayFirst_branches_Onsite_Order
); //Update Order Received Money PayFirst branches Onsite  Order
router.patch(
  "/update-an-onsite-pay-later-order-by-clicking-money-bag-by-admin/:orderID",
  UpdateOrder_ReceivedMoney_PayLast_branches_Onsite_Order
); //Update Order Received Money pay later branches Onsite  Order
router.patch("/apporve-an-order/:orderID", approveDishItem); //admin approve dish item placed to approved for cook
router.delete("/cancel-an-order/:orderID", deleteOrder); //cancel an order

router.patch(
  "/approve-to-cook/:orderID",
  order_Is_being_Prepared_By_KOT_Approval
); ///kitchen staff is cooking the food
router.patch(
  "/approve-to-ready-to-serve/:orderID",
  order_Prepared_and_ready_to_serve_By_KOT_Approval
); //kitchen staff completed the food cooking

//attendance 
const {takeAttendense,attendancePerEmployee} = require('../controller/attendenseController')
router.post('/admin/restaurant/:res_id/branch/:branchID/upload-attendence', takeAttendense)
router.get("/restaurant/:res_id/branch/:branchID/get-attendance/:user_id/month/:currentMonth",attendancePerEmployee)
router.get("/restaurant/:res_id/branch/:branchID/delivery-man-list",  allDeliveryBoyForBranch)
router.patch("/restaurant/:res_id/branch/:branchID/assign-delivery-boy", assignDeliveryPartnerForOffsiteOrder);
router.patch("/onsite-pay-first-order-delivered/:orderID",Onsite_Order_Update_Status_for_completed)
router.patch("/handle-proceed-to-ready-to-delivery/:orderID",handleProceedTOReadyToDelivery);
router.patch("/handle-proceed-to-delivered/:orderID",verifyOtpAndCompleteOrder);



module.exports = router;




