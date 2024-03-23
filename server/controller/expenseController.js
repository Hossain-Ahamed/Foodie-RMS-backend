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
  const data = await Expense.find({branchID: branchID});
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "No Data Found!" });
  }
};

module.exports = {
  createExpense,
  showAllExpense,
};
