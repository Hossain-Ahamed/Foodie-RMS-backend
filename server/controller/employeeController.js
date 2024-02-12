// const {createUserAccount} = require("../config/firbase-config");
const Employee = require("../model/employeeModel");
const createClient = require("./clientController");
const uuid = require("uuid");
const addEmployee = async (req, res) => {
  try {
    const {
      f_name,
      l_name,
      permitted,
      email,
      gender,
      DOB,
      nid,
      designation,
      mobile,
      profilePhoto,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      emergencyAddress,
      emergencyEmail,
      emergencyName,
      emergencyPhoneNumber,
      emergencyRelation,
      salary_type,
      salary_unit,
    } = req.body;

    if (!f_name || !l_name || !email) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    } else {
      let employeeExist = await Employee.findOne({ email: email });
      if (employeeExist) {
        return res.status(409).json({ msg: `${email} already exists` });
      } else {
        const newEmployee = new Employee({
          f_name,
          l_name,
          permitted,

          email,
          gender,
          DOB,
          nid,
          designation,
          mobile,

          profilePhoto,
          streetAddress,
          city,
          stateProvince,
          postalCode,
          country,
          emergencyAddress,
          emergencyEmail,
          emergencyName,
          emergencyPhoneNumber,
          emergencyRelation,
          salary_type,
          salary_unit,
        });

        const result = await newEmployee.save();
        res.status(201).json(result);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const allEmployee = async (req, res) => {
  try {
    const employee = await Employee.find({ deleteStatus: false });
    // console.log(categories);
    res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

//create user account
const createUAccount = async (req, res) => {
  try {
    const {email} = req.body;
    const password = uuid.v4();
    const user = await Employee.findOne({ email: email });
    if (!user) {
      createUserAccount({ email, password });
      createClient({ email, password });
      res.status(200).send(true);
    } else {
      res.status(409).send(false);
    }
  } catch (error) {
    console.log(error);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById({
      _id: employeeId,
      deleteStatus: false,
    });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const {
      f_name,
      l_name,
      permitted,
      email,
      gender,
      DOB,
      nid,
      designation,
      mobile,
      profilePhoto,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      emergencyAddress,
      emergencyEmail,
      emergencyName,
      emergencyPhoneNumber,
      emergencyRelation,
      salary_type,
      salary_unit,
    } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        f_name,
        l_name,
        permitted,

        email,
        gender,
        DOB,
        nid,
        designation,
        mobile,

        profilePhoto,
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
        emergencyAddress,
        emergencyEmail,
        emergencyName,
        emergencyPhoneNumber,
        emergencyRelation,
        salary_type,
        salary_unit,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        deleteStatus: true,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json({ msg: "Employee deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const SearchEmployee = async(req,res)=>{
  try {
    const data = req.body;
    console.log(data);
  } catch (error) {
    
  }
}

module.exports = {
  SearchEmployee,
  allEmployee,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  // createUAccount,
};
