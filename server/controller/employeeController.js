// const {createUserAccount} = require("../config/firbase-config");
const Employee = require("../model/employeeModel");
const { responseError } = require("../utils/utility");
const createClient = require("./clientController");
const uuid = require("uuid");
const JWT = require("jsonwebtoken");
const branchModel = require("../model/branchModel");
const restaurantModel = require("../model/restaurantModel");
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

const addExistingEmployee = async (req, res) => {
  try {
    const { res_id, branchID, employeeID } = req.params;
    const existingEmployee = await Employee.findOne({
      _id: employeeID,
      "permitted.res_id": res_id,
    }).select("f_name");

    if (!existingEmployee) {
      const { res_id, branchID, role, salary_type, salary_unit } = req.body;
      const result = await Employee.findByIdAndUpdate(
        employeeID,
        {
          $push: {
            permitted: {
              res_id: res_id,
              branchID: branchID,
              role: role,
              salary_type: salary_type,
              salary_unit: salary_unit,
            },
          },
        },
        { new: true }
      );
      res.status(200).json(result);
    } else {
      res.status(409).json({ message: "Already Enlisted employee" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { res_id, employeeId } = req.params;

    const employee = await Employee.findById({
      _id: employeeId,
      deleteStatus: false,
    }).select("-permitted");
    const allBranches_beforeRename = await branchModel
      .find({ res_id: res_id })
      .select("_id branch_name");

    const allBranches = allBranches_beforeRename.map((i) => {
      return {
        branchID: i?._id,
        branch_name: i?.branch_name,
      };
    });

    const RestaurantData = await restaurantModel
      .findById({ _id: res_id })
      .select("_id res_name img");

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json({
      employeeData: employee,
      restaurantData: {
        _id: RestaurantData?._id,
        res_name: RestaurantData?.res_name,
        img: RestaurantData?.img,
        branches: allBranches,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// --------------------- get branch and restaurant data for Adding New Employee 
const getAllBranch_And_ResturantData = async (req, res) => {
  try {
    const { res_id } = req.params;

    const allBranches_beforeRename = await branchModel
      .find({ res_id: res_id })
      .select("_id branch_name");

    const allBranches = allBranches_beforeRename.map((i) => {
      return {
        branchID: i?._id,
        branch_name: i?.branch_name,
      };
    });

    const RestaurantData = await restaurantModel
      .findById({ _id: res_id })
      .select("_id res_name img");

    res.status(200).json({
        _id: RestaurantData?._id,
        res_name: RestaurantData?.res_name,
        img: RestaurantData?.img,
        branches: allBranches,
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
//-------------------------

const getEmployeeData_ByID_ForCurrentEmployeeEdit = async (req, res) => {
  try {
    console.log("hello");
    const { res_id, employeeID } = req.params;
    const employee = await Employee.findById({
      _id: employeeID,
      "permitted.res_id": res_id,
      deleteStatus: false,
    });

    const allBranches_beforeRename = await branchModel
      .find({ res_id: res_id })
      .select("_id branch_name");

    const allBranches = allBranches_beforeRename.map((i) => {
      return {
        branchID: i?._id,
        branch_name: i?.branch_name,
      };
    });

    const RestaurantData = await restaurantModel
      .findById({ _id: res_id })
      .select("_id res_name img");

    const EmployeeData_inThatRestaurant = employee.permitted.find((item) => item?.res_id == res_id);
 console.log(EmployeeData_inThatRestaurant?.branchID)

    const EmployeeBranchName_inThatRestaurant = allBranches.find((item) => item?.branchID.toString() == EmployeeData_inThatRestaurant?.branchID);

    console.log(EmployeeData_inThatRestaurant,EmployeeBranchName_inThatRestaurant);

    res.status(200).json({
      employeeData: {
        _id: employee._id,
        f_name: employee.f_name,
        l_name: employee.l_name,
        email: employee.email,

        mobile: employee.mobile,
        gender: employee.gender,
        nid: employee.nid,
        uid: employee.uid,

        DOB: employee.DOB,
        profilePhoto: employee.profilePhoto,
        streetAddress: employee.streetAddress,
        city: employee.city,
        stateProvince: employee.stateProvince,
        postalCode: employee.postalCode,
        country: employee.country,

        emergencyName: employee.emergencyName,
        emergencyRelation: employee.emergencyRelation,
        emergencyPhoneNumber: employee.emergencyPhoneNumber,
        emergencyEmail: employee.emergencyEmail,
        emergencyAddress: employee.emergencyAddress,

        res_id: RestaurantData?._id,
        res_img: RestaurantData?.img,
        res_name: RestaurantData?.res_name,
        branch_name: EmployeeBranchName_inThatRestaurant?.branch_name,
        branchID: EmployeeBranchName_inThatRestaurant?.branchID,
        role: EmployeeData_inThatRestaurant?.role  ,
        salary_type: EmployeeData_inThatRestaurant?.salary_type  ,
        salary_unit: EmployeeData_inThatRestaurant?.salary_unit  ,
      },
      restaurantData: {
        _id: RestaurantData?._id,
        res_name: RestaurantData?.res_name,
        img: RestaurantData?.img,
        branches: allBranches,
      },
    });
  } catch (error) {
    responseError(res,500,error)
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const {
      f_name,
      l_name,
      email,
      gender,
      DOB,
      nid,
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
      role,
      res_id,
      branchID,
    } = req.body;
    console.log(req.body)
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        f_name,
        l_name,
        email,
        gender,
        DOB,
        nid,
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
      },
      { new: true }
    );
    const updatedPermitted = {
      role,
      res_id,
      branchID,
      salary_type,
      salary_unit,
    };

    const latest_employee = await Employee.findByIdAndUpdate({ _id: employeeId, "permitted.res_id": res_id },
    {
      $set: {
        "permitted": updatedPermitted,
      },
    },
    { new: true }
    )


    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json(latest_employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const res_id = req.params.res_id; // Assuming res_id is part of req.params
    const branchID = req.params.branchID; // Assuming branchID is part of req.params

    // Update the employee by removing all matching entries from the permitted array
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $pull: {
          permitted: { res_id, branchID },
        },
        deleteStatus: true,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json({ msg: "Employee deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const SearchEmployee = async (req, res) => {
  try {
    const data = req.body;
    const searchData = await Employee.find(data);
    console.log(data);
    res.status(200).send(searchData);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const allEmployeeForBranch = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const employees = await Employee.find({
      "permitted.res_id": res_id,
      "permitted.branchID": branchID,
    }).select("f_name l_name email profilePhoto nid _id mobile permitted");

    if (!employees || employees.length === 0) {
      responseError(res, 404, "No Employee Found");
    } else {
      const formattedEmployees = await Promise.all(
        employees.map(async (employee) => {
          const {
            f_name,
            l_name,
            email,
            profilePhoto,
            nid,
            _id,
            mobile,
            permitted,
          } = employee;
          const matchedPermitted = permitted.find(
            (p) => p.res_id.toString() === res_id
          );
          const formattedPermitted = matchedPermitted
            ? {
                branchID: matchedPermitted.branchID,
                role: matchedPermitted.role,
              }
            : null;
          const data = await branchModel
            .findById(formattedPermitted.branchID)
            .select("branch_name");

          const returnData = {
            f_name,
            l_name,
            email,
            profilePhoto,
            nid,
            _id,
            mobile,
            role: formattedPermitted?.role,
            branchID: formattedPermitted?.branchID,
            branchName: data?.branch_name,
          };
          return returnData;
        })
      );
      res.status(200).send(formattedEmployees);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const allEmployeeForRestaurent = async (req, res) => {
  try {
    const { res_id } = req.params;
    const employees = await Employee.find({
      "permitted.res_id": res_id,
    }).select("f_name l_name email profilePhoto nid _id mobile permitted");

    if (!employees || employees.length === 0) {
      responseError(res, 404, "No Employee Found");
    } else {
      const formattedEmployees = await Promise.all(
        employees.map(async (employee) => {
          const {
            f_name,
            l_name,
            email,
            profilePhoto,
            nid,
            _id,
            mobile,
            permitted,
          } = employee;
          const matchedPermitted = permitted.find(
            (p) => p.res_id.toString() === res_id
          );
          const formattedPermitted = matchedPermitted
            ? {
                branchID: matchedPermitted.branchID,
                role: matchedPermitted.role,
              }
            : null;
          const data = await branchModel
            .findById(formattedPermitted.branchID)
            .select("branch_name");

          const returnData = {
            f_name,
            l_name,
            email,
            profilePhoto,
            nid,
            _id,
            mobile,
            role: formattedPermitted?.role,
            branchID: formattedPermitted?.branchID,
            branchName: data?.branch_name,
          };
          return returnData;
        })
      );
      res.status(200).send(formattedEmployees);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const employeeRole = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      responseError(res, 401, "email not found");
    } else {
      // const checkEmail = await Employee.aggregate([
      //   {
      //     $match: { email: email },
      //   },
      //   {
      //     $lookup: {
      //       from: "branches",
      //       localField: "permitted.branchID",
      //       foreignField: "_id",
      //       as: "branches"
      //     }
      //   },
      //   {
      //     $unwind: "$branches"
      //   },
      //   {
      //     $lookup: {
      //       from: "restaurants",
      //       localField: "permitted.res_id",
      //       foreignField: "_id",
      //       as: "restaurants"
      //     }
      //   },
      //   {
      //     $unwind: "$restaurants"
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       f_name: 1,
      //       l_name: 1,
      //       email: 1,
      //       gender: 1,
      //       DOB: 1,
      //       nid: 1,
      //       mobile: 1,
      //       commentNotes: 1,
      //       profilePhoto: 1,
      //       streetAddress: 1,
      //       city: 1,
      //       stateProvince: 1,
      //       postalCode: 1,
      //       country: 1,
      //       emergencyAddress: 1,
      //       emergencyEmail: 1,
      //       emergencyName: 1,
      //       emergencyPhoneNumber: 1,
      //       emergencyRelation: 1,
      //       "permitted.res_img": "$restaurants.img",
      //       "permitted.res_name": "$restaurants.res_name",
      //       "permitted.res_id": "$restaurants._id",
      //       "permitted.branch_name": "$branches.branch_name",
      //       "permitted.branchID": "$branches._id",
      //       "permitted.role": 1
      //     }
      //   },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       f_name: { $first: "$f_name" },
      //       l_name: { $first: "$l_name" },
      //       email: { $first: "$email" },
      //       gender: { $first: "$gender" },
      //       DOB: { $first: "$DOB" },
      //       nid: { $first: "$nid" },
      //       mobile: { $first: "$mobile" },
      //       commentNotes: { $first: "$commentNotes" },
      //       profilePhoto: { $first: "$profilePhoto" },
      //       streetAddress: { $first: "$streetAddress" },
      //       city: { $first: "$city" },
      //       stateProvince: { $first: "$stateProvince" },
      //       postalCode: { $first: "$postalCode" },
      //       country: { $first: "$country" },
      //       emergencyAddress: { $first: "$emergencyAddress" },
      //       emergencyEmail: { $first: "$emergencyEmail" },
      //       emergencyName: { $first: "$emergencyName" },
      //       emergencyPhoneNumber: { $first: "$emergencyPhoneNumber" },
      //       emergencyRelation: { $first: "$emergencyRelation" },
      //       permitted: { $first: "$permitted" }
      //     }
      //   }
      // ]).exec();
      const checkEmail = await Employee.findOne({ email: email })
        .populate({
          path: "permitted.res_id",
          model: "Restaurants",
          select: "_id img res_name",
        })
        .populate({
          path: "permitted.branchID",
          model: "Branches",
          select: "_id branch_name",
        });

      if (checkEmail) {
        const transformedData = {
          _id: checkEmail?._id,
          f_name: checkEmail?.f_name,
          l_name: checkEmail?.l_name,
          email: checkEmail?.email,
          gender: checkEmail?.gender,
          DOB: checkEmail?.DOB,
          nid: checkEmail?.nid,
          mobile: checkEmail?.mobile,
          commentNotes: checkEmail?.commentNotes,
          profilePhoto: checkEmail?.profilePhoto,
          streetAddress: checkEmail?.streetAddress,
          city: checkEmail?.city,
          stateProvince: checkEmail?.stateProvince,
          postalCode: checkEmail?.postalCode,
          country: checkEmail?.country,
          emergencyAddress: checkEmail?.emergencyAddress,
          emergencyEmail: checkEmail?.emergencyEmail,
          emergencyName: checkEmail?.emergencyName,
          emergencyPhoneNumber: checkEmail?.emergencyPhoneNumber,
          emergencyRelation: checkEmail?.emergencyRelation,
          permitted: checkEmail?.permitted.map((permit) => ({
            res_img: permit?.res_id?.img,
            res_name: permit?.res_id?.res_name,
            res_id: permit?.res_id?._id,
            branch_name: permit?.branchID?.branch_name,
            branchID: permit?.branchID?._id,
            role: permit?.role,
          })),
        };

        res.status(200).json(transformedData);
      } else {
        responseError(res, 404, "User Not Registered");
      }
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const employeeLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await Employee.findOne({ email: email });
    if (!checkEmail) {
      return responseError(res, 401, "Invalid Email or Password");
    } else {
      const permitted = checkEmail.permitted;

      // Your logic to extract relevant information from the 'permitted' array
      const payload = {
        // Include relevant fields from 'permitted' array or other employee details
        email: checkEmail.email,
        role: permitted,
      };
      const options = { expiresIn: "6h" }; // Optional: Set the token expiration time

      const token = JWT.sign(payload, process.env.secretKey, options);

      // console.log(token)

      res.cookie("_foodie_RRR_T", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({ token: token, data: "Logged in Successfully" });
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

module.exports = {
  employeeRole,
  allEmployeeForRestaurent,
  allEmployeeForBranch,
  SearchEmployee,
  allEmployee,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  employeeLogin,
  addExistingEmployee,
  getEmployeeData_ByID_ForCurrentEmployeeEdit,
  getAllBranch_And_ResturantData,
};
