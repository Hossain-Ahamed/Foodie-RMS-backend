const Expense = require("../model/expenseModel");

//creation of a new expense
const createExpense = async (req, res) => {
  try {
    const {
      res_id,
      branchID,
      category,
      billDate,
      expense,
      payTo,
      payeeID,
      vendorDescription,
      paymentDate,
      paymentAmount,
      reference,
      description,
    } = req.body;

    const newExpense = new Expense({
      res_id,
      branchID,
      category,
      billDate,
      expense,
      payTo,
      payeeID,
      vendorDescription,
      transactions: [
        {
          paymentDate,
          paymentAmount,
          reference,
          description,
        },
      ],
    }).save();

    res.status(201).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//show expense in the list
const showAllExpense = async (req, res) => {
  const { branchID } = req.params
  const data = await Expense.find({ branchID: branchID, deleteStatus: false});
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "No Data Found!" });
  }
};

//getExpenseById
const getExpenseById = async (req, res) => {
  try {
    const { _id } = req.params;
    const expenseData = await Expense.find({
      deleteStatus: false,
      _id: _id,
    });
    res.status(200).send(expenseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const {
      res_id,
      branchID,
      category,
      billDate,
      expense,
      payTo,
      payeeID,
      vendorDescription,
      paymentDate,
      paymentAmount,
      reference,
      description,
    } = req.body;
    const data = {
      paymentDate,
      paymentAmount,
      reference,
      description,
    }
    const { _id } = req.params;
    const a = await Expense.find({_id: _id})
    Expense.transactions.push(data)
    const expenseUpdate = await Expense.findByIdAndUpdate(
      _id,
      {
        res_id,
        branchID,
        category,
        billDate,
        expense,
        payTo,
        payeeID,
        vendorDescription,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(false);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { _id } = req.params;
    await Expense.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    res.status(400).send(false);
  }
};

module.exports = {
  createExpense,
  showAllExpense,
  deleteExpense,
  updateExpense,
  getExpenseById
};
