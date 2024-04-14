const Attendense = require("../model/attendenseModel");

const getMonthAbbreviation = (monthIndex) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthIndex];
};
const takeAttendense = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const { attendance } = req.body;
    const attendence = attendance.map(({ user_id, status }) => ({
      user_id,
      status,
    }));
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const monthAbbreviation = getMonthAbbreviation(today.getMonth());
    const newAttendance = new Attendense({
      res_id,
      branchID,
      date,
      month: monthAbbreviation,
      attendence,
    }).save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ error: "Could not create attendance" });
  }
};
module.exports = {
  takeAttendense,
};
