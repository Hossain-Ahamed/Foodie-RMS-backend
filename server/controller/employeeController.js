// const {createUserAccount} = require("../config/firbase-config");
const Employee = require("../model/employeeModel");
const { responseError } = require("../utils/utility");
const createClient = require("./clientController");
const { createUserAccount } = require("../config/firbase-config.js");
const admin = require("firebase-admin");
const uuid = require("uuid");
const JWT = require("jsonwebtoken");
const branchModel = require("../model/branchModel");
const restaurantModel = require("../model/restaurantModel");
const sendMail = require("../utils/sendEmail.js");
const addEmployee = async (req, res) => {
  try {
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

    if (!f_name || !l_name || !email) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    } else {
      let employeeExist = await Employee.findOne({ email: email });
      if (employeeExist) {
        return res.status(409).json({ msg: `${email} already exists` });
      } else {
        const password = uuid.v4().slice(0, 8);
        // Check if the email already exists
        admin
          .auth()
          .getUserByEmail(email)
          .then((userRecord) => {
            res
              .status(409)
              .json({ msg: `${email} already exists in firebase` }); // If the userRecord exists, the email is already in use
          })
          .catch((error) => {
            createUserAccount({ name: f_name + " " + l_name, email, password })
              .then((res) => {
                try {
                  sendMail({
                    email: email,
                    subject: "Foodie- Login Credentitals",
                    to: email,
                    // message: `Hello ${name}, this is your email: ${email} and password: ${password} for log in`,

                    message: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding:0;Margin:0"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New email template 2024-02-17</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
                              <![endif]--><style type="text/css">#outlook a { padding:0;}.ExternalClass { width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div { line-height:100%;}.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}.es-button-border:hover a.es-button, .es-button-border:hover button.es-button { background:#ffffff!important;} .es-button-border:hover { background:#ffffff!important; border-style:solid solid solid solid!important; border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;}
                              @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:20px!important; text-align:center } h2 { font-size:16px!important; text-align:left } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:20px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:16px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:10px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important }
                               .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:14px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important }
                               .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important }
                               table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
                               </head> <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"><tr style="border-collapse:collapse">
                               <td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td class="es-adaptive" align="center" style="padding:0;Margin:0"><table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3d5ca3;width:600px" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"><tr style="border-collapse:collapse"><td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#3d5ca3" bgcolor="#3d5ca3" align="left"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr>
                              <td style="width:100px" valign="top"><![endif]--><table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr style="border-collapse:collapse"><td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:100px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;font-size:0px"><img src="https://i.ibb.co/k9Bbgpg/brand-icon.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="93" height="93"></td> </tr></table></td></tr></table> <!--[if mso]></td><td style="width:20px"></td>
                              <td style="width:440px" valign="top"><![endif]--><table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;width:440px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-bottom:15px;padding-top:30px"><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#f6eceb"><b>Foodie Restaurant Management System</b></h1></td></tr></table></td></tr> </table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table>
                              <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr style="border-collapse:collapse">
                              <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top" bgcolor="transparent" align="left"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0"><tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0"><img src="https://efnrmol.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="175" height="208"></td> </tr><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333"><b>Thank you for choosing Foodie&nbsp;</b></h1></td></tr><tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px;text-align:left">HI, ${name}</p></td></tr> <tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-right:35px;padding-left:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px">Here are your login details:</p></td></tr><tr style="border-collapse:collapse">
                              <td align="left" style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px"><strong>Email:</strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${email}<br><strong>Password</strong>&nbsp;&nbsp;${password}</p></td> </tr><tr style="border-collapse:collapse"><td style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:red;font-size:16px;margin-top:1.5rem">NB:If you have received this email in error, kindly notify us immediately to rectify the situation. Please delete this email and all accompanying documents promptly. Your cooperation in this matter is greatly appreciated..</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`,
                  });
                } catch {
                  (e) => {
                    console.log(e);
                  };
                }
              })
              .catch((e) => console.log(e));
          });

        createClient({ email, password }); //email password save for compliance record

        //save employee data
        const newEmployee = new Employee({
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
          permitted: [{ res_id, branchID, role, salary_type, salary_unit }],
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

    const EmployeeData_inThatRestaurant = employee.permitted.find(
      (item) => item?.res_id == res_id
    );
    console.log(EmployeeData_inThatRestaurant?.branchID);

    const EmployeeBranchName_inThatRestaurant = allBranches.find(
      (item) =>
        item?.branchID.toString() == EmployeeData_inThatRestaurant?.branchID
    );

    console.log(
      EmployeeData_inThatRestaurant,
      EmployeeBranchName_inThatRestaurant
    );

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
        role: EmployeeData_inThatRestaurant?.role,
        salary_type: EmployeeData_inThatRestaurant?.salary_type,
        salary_unit: EmployeeData_inThatRestaurant?.salary_unit,
      },
      restaurantData: {
        _id: RestaurantData?._id,
        res_name: RestaurantData?.res_name,
        img: RestaurantData?.img,
        branches: allBranches,
      },
    });
  } catch (error) {
    responseError(res, 500, error);
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

    const updatedEmployee = await Employee.findByIdAndUpdate(
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

    if (!updatedEmployee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Use map to update the permitted array
    updatedEmployee.permitted = updatedEmployee.permitted.map((permit) => {
      if (permit.res_id.toString() === res_id) {
        return {
          ...permit,
          role: role || permit.role,
          res_id,
          branchID: branchID || permit.branchID,
          salary_type: salary_type || permit.salary_type,
          salary_unit: salary_unit || permit.salary_unit,
        };
      }
      return permit;
    });

    // Save the updated employee with the modified permitted array
    await updatedEmployee.save();

    // Fetch the latest employee details after the updates
    const latestEmployee = await Employee.findById(employeeId);

    res.status(200).json(latestEmployee);
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
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: employeeId },
      {
        $pull: {
          permitted: {
            res_id,
            branchID,
          },
        },
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
    const {data} = req.body;
    console.log(data);
    const regex = new RegExp(data, 'i'); // 'i' flag for case-insensitive search

    // Perform the search using regex on relevant fields
    const searchData = await Employee.find({
      $or: [
        { f_name: { $regex: regex } },
        { l_name: { $regex: regex } },
        { email: { $regex: regex } },
        { mobile: { $regex: regex } },
        { nid: { $regex: regex } } // If you want to include NID in the search
      ]
    });
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

const allBranchesOfSuperAdmin = async (req, res) => {
  try {
    const { email ,res_id} = req.params;

    const response = [];
    if (!email) {
      responseError(res, 401, "email not found");
    } else {
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
        })
        .select("permitted");

      if (checkEmail) {
        checkEmail?.permitted.map((permit) => {
          if (permit?.res_id?._id == res_id) {
            response.push({
              res_img: permit?.res_id?.img,
              res_name: permit?.res_id?.res_name,
              res_id: permit?.res_id?._id,
              branch_name: permit?.branchID?.branch_name,
              branchID: permit?.branchID?._id,
              role: permit?.role,
            });
          }
        });

        res.status(200).json(response);
      } else {
        responseError(res, 404, "User Not Registered all brance");
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
  allBranchesOfSuperAdmin,
};
