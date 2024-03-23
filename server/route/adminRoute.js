const express = require("express");
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
} = require("../controller/subscriptionController");

const {
  deleteBranchFromDevPaymentList,
  deactivateBranchFromDevPaymentList,
  notifyOwnerFromDev,
} = require("../controller/devSubscriptionsEdit");

const {
  createExpense,
  showAllExpense,
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
const { getPrintingSetUp, showPrintingSetUp } = require("../controller/printingSetUpController");

const router = express.Router();
// http://localhost:5000/admin/login

//For create => Restricted  Route (Only for admin)
router.post("/create-restaurant", createResturant); // Create a new Restaurant in the database
router.post("/admin/create/branch", createBranch); // Create a new branch in the database
router.post(
  "/admin/restaurant/:res_id/branch/:branchID/add-category",
  addCategory
); // Add a new category to the list of categories
router.post("/admin/add-an-employee-to-the-system", addEmployee); // Create a new employee in the database
router.post("/admin/:res_id/add-new-dishes/:branchID", createDishes); //Create a new dish from the menu
router.post("/create-payment-intent", CreatePaymentIntent);

router.get("/edit-restaurant/:_id", sendRestaurantData);
router.get("/admin/get-all-categories-name/:branchID", getAllCategoryTitles);
router.get("/admin/get-all-dishes/:branchID", getDishesByBranchId);
router.get("/subscription-payment/:branchID", getPaymentDetails);
// For Read => Public Route (Accessible for any admin)
router.get("/admin/read/restaurant", getAllResturants); // Get all available restaurant
router.get("/admin/:branchID/all-categories", allCategory); // Get all available Categories
router.get("/admin/read/employee", allEmployee); // Get all employees from the database
// router.get('/admin/read/dish', getDish);                  //Get All Dishes
router.get("/all-branch-payment-wise-list-for-dev-admins", getAllBranch);
// router.get("/subscription-packages", getAllSubscriptionPackage); //get all packages

//For ReadById =>  Private Route (Only for admin and super user)
router.get("/admin/get-categories/:id", getCategoryById); // Get Category by ID
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
router.post(
  "/add-an-employee-to-my-restaurant/:res_id/:branchID/employee/:employeeID",
  addExistingEmployee
);
router.post("/enlisted-payment", updatePackageAfterPayment);

//For  Update => Admin or Super User Access (Admin can only update his own profile)
router.put("/admin/update/restaurant/:id", updateResturant); //Update restaurant By ID
router.put("/admin/update/brach/:_id", updateResturant); //Update branch By ID
router.patch("/admin/edit-categories/:id", updateCategory); //Update Category By ID
router.patch("/admin/update/employee/:id", updateEmployeeById); //Update Employee  By  ID for my current employee
router.put("/admin/update/dish/:_id", updateDish); //Update The Dish By its id

//For Delete => Admin Only (No one else can delete an account)
router.delete("/admin/delete/restaurant/:id", deleteResturent); //Delete A restaurant By Its ID
router.delete("/admin/delete/branch/:_id", deleteBranch); //Delete A branch By Its ID
router.delete("/admin/delete-categories/:id", deleteCategory); //Delete A Category By Its ID
router.delete("/admin/delete-dishes/:_id", deleteDish); //Delete a dish by its id
router.delete(
  "/admin/restaurant/:res_id/branch/:branchID/delete/employee/:id",
  deleteEmployeeById
); //Delete An Employee
router.delete("/admin/delete/dish/:_id", deleteDish); //Delete An Employee

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
router.get("/admin/all-expenses", showAllExpense);


//printing Setup
router.get("/restaurant/:res_id/branch/:branchID/payment-slip-format", getPrintingSetUp);
router.patch("/restaurant/:res_id/branch/:branchID/payment-slip-format", showPrintingSetUp);

//Tables
router.get("/restaurant/:res_id/branch/:branchID/tables",getBranchesTable)
router.post("/restaurant/:res_id/branch/:branchID/tables",addTables)
router.delete("/restaurant/:res_id/branch/:branchID/tables/:number",barnchTableDelete);

//login dev panel

router.post("/dev-admin-login", devLogIn);

// Subscription data for supper admin
router.get(
  "/restaurant/:res_id/bill-history-list",
  getSubscriptionPurchaseHistory
);

module.exports = router;
