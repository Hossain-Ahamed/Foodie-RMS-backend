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
    const { attendanceData } = req.body;
    const attendence = attendanceData.map(({ user_id, status }) => ({
      user_id,
      status,
    }));
    const today = new Date();
    const date = today.toISOString();
    const monthAbbreviation = getMonthAbbreviation(today.getMonth());
    const newAttendance = await new Attendense({
      res_id,
      branchID,
      date,
      month: monthAbbreviation,
      attendense: attendence,
    }).save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create attendance" });
  }
};

const attendancePerEmployee = async (req, res) => {
  try {
    const c_month = req.params.currentMonth.split("-")[0];
    const { user_id } = req.params;
    const data = await Attendense.find({ month: c_month });
    const yesDates = [];
    data.forEach((attendance) => {
      attendance.attendense.forEach((e) => {
        if (e.user_id.toString() === user_id && e.status === 'Yes') {
          yesDates.push(attendance.date);
        }
      });
    });
    res.status(200).json({ yesDates });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create attendance" });
  }
};
module.exports = {
  takeAttendense,
  attendancePerEmployee,
};
