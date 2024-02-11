const express = require("express");
const {
  allEmployee,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  createUAccount,
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
} = require("../controller/dishesControllers");

const {
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controller/branchController");

const {
  getAllResturants,
  createResturant,
  updateResturant,
  deleteResturent,
  createAccount,
} = require("../controller/restaurantController");

const {
  createSubscription,
  extendSubscription,
  CreatePaymentIntent,
  getPaymentDetails,
  updatePackageAfterPayment,
} = require("../controller/subscriptionController");

const { createExpense } = require("../controller/expenseController");

const router = express.Router();
// http://localhost:5000/admin/login

//For create => Restricted  Route (Only for admin)
router.post("/create-restaurant", createResturant); // Create a new Restaurant in the database
router.post("/admin/create/branch", createBranch); // Create a new branch in the database
router.post("/admin/create/categories", addCategory); // Add a new category to the list of categories
router.post("/admin/create/employee", addEmployee); // Create a new employee in the database
router.post("/admin/create/dish", createDishes); //Create a new dish from the menu
router.post("/create-payment-intent", CreatePaymentIntent);
router.get("/subscription-payment/:branchID", getPaymentDetails);
// For Read => Public Route (Accessible for any admin)
router.get("/admin/read/restaurant", getAllResturants); // Get all available restaurant
router.get("/admin/read/categories", allCategory); // Get all available Categories
router.get("/admin/read/employee", allEmployee); // Get all employees from the database
// router.get('/admin/read/dish', getDish);                  //Get All Dishes

//For ReadById =>  Private Route (Only for admin and super user)
router.get("/admin/readbyid/categories/:id", getCategoryById); // Get Category by ID
router.get("/admin/readbyid/employee/:id", getEmployeeById); // Get Employee By Id
router.post("/enlisted-payment", updatePackageAfterPayment);

//For  Update => Admin or Super User Access (Admin can only update his own profile)
router.put("/admin/update/restaurant/:id", updateResturant); //Update restaurant By ID
router.put("/admin/update/brach/:_id", updateResturant); //Update branch By ID
router.put("/admin/update/categories/:id", updateCategory); //Update Category By ID
router.put("/admin/update/employee/:id", updateEmployeeById); //Update Employee  By  ID
router.put("/admin/update/dish/:_id", updateDish); //Update The Dish By its id

//For Delete => Admin Only (No one else can delete an account)
router.delete("/admin/delete/restaurant/:id", deleteResturent); //Delete A restaurant By Its ID
router.delete("/admin/delete/branch/:_id", deleteBranch); //Delete A branch By Its ID
router.delete("/admin/delete/categories/:id", deleteCategory); //Delete A Category By Its ID
router.delete("/admin/delete/employee/:id", deleteEmployeeById); //Delete An Employee
router.delete("/admin/delete/dish/:_id", deleteDish); //Delete An Employee

//Subscription Route
// router.post("/admin/subscription", createSubscription);
// router.get("/admin/all-subscriptions",getAllSubscriptions);
router.post("/admin/extend-subscription/", extendSubscription);
router.patch('/payment-package/branch/:branchID', createSubscription)

//Create Account
router.post("/admin/create/account/emplyoee", createUAccount);
router.post("/admin/create/account/owner", createAccount);

//Expense Route
router.post("/admin/create/expense", createExpense);

module.exports = router;
