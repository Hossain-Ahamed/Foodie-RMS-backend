const branchModel = require("../model/branchModel");
const restaurantModel = require("../model/restaurantModel");
const subscriptionModel = require("../model/subscriptionModel");
const cartModel = require("../model/cartModel.js");
const category = require("../model/categoryModel.js");
const coupon = require("../model/couponModel.js");
const dish = require("../model/dishesModel.js");
const expense = require("../model/expenseModel.js");
const print = require("../model/printingSetUpModel.js");
const vendor = require("../model/vendorModel.js");
const { responseError } = require("../utils/utility");
const employeeModel = require("../model/employeeModel.js");
const subcripstionPackages = require("../model/subcripstionPackages.js");
const sendMail = require("../utils/sendEmail.js");
const { link } = require("fs/promises");
const facebookAppIDModel = require("../model/facebookAppIDModel.js");

// create branch

const createBranch = async (req, res) => {
  try {
    const { res_id } = req.params;
    const {
      branch_name,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      packageType,
    } = req.body;
    //   if (branchModel.findOne({ branch_name:branch_name, res_id:res_id })) {
    //     return res.status(400).send({
    //       success: false,
    //       message: "Branch Already Exists",
    //     });
    //   }

    let startDate = Date.now();
    const Subscription_package_data = await subcripstionPackages.findOne({
      packageType: packageType,
    });
    if (!Subscription_package_data) {
      return res.status(400).json({ error: "Subscription package not found" });
    }
    let endDate =
      startDate +
      Subscription_package_data?.duration * 30 * 24 * 60 * 60 * 1000;

    const check_res = await restaurantModel.findById(res_id);
    if (!check_res) {
      return responseError(res, 404, "Invalid Restaurant Id");
    }
    const branch = await new branchModel({
      res_id,
      branch_name,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
    }).save();

    const newSubscription = await new subscriptionModel({
      res_id: check_res._id,
      branchID: branch._id,
      packageType,
      startDate: 0,
      endDate: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      previousSubscriptions: [
        {
          packageType,
          startDate: 0,
          endDate: 0,
          payment_time: 0,
          price: 0,
          transactionID: "null",
        },
      ],
    }).save();

    const ExistingSuperAdminProfile = await employeeModel.findOne({ "permitted.res_id": res_id, "permitted.role": "Super-Admin" });
    console.log(ExistingSuperAdminProfile)
    if(!ExistingSuperAdminProfile){
      return responseError(res,404,{msg : "search failed"},"No super admin profile found")
    }
    const employee = await employeeModel.findByIdAndUpdate(
      ExistingSuperAdminProfile._id,
      {
        $push: {
          permitted: {
            res_id: res_id,
            branchID: branch._id,
            role: "Super-Admin",
          },
        },
      },
      { new: true }
    );
    const link = process.env.LINK + `/subscription-payment/${branch._id}`;
    sendMail({
      email: check_res.res_Owner_email,
      subject: "Foodie- Branch Payment Link",
      to: check_res.res_Owner_email,
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
      <td align="center" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px;text-align:left">Hi ${check_res?.res_Owner_Name},</p></td></tr> <tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-right:35px;padding-left:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px">Here are your payment link: <a href=${link}>Click to Pay</a></p></td></tr><tr style="border-collapse:collapse">
    <td style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:red;font-size:16px;margin-top:1.5rem">NB: Please do not share this information with anyone.</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`,
    });

    res.status(200).send({ branchID: branch._id });
  } catch (err) {
    console.log(err);
    res.status(400).send(false);
  }
};

//delete branch
const deleteBranch = async (req, res) => {
  const { branchID, res_id } = req.params;
  try {
    await branchModel.findByIdAndDelete(branchID);
    await subscriptionModel.deleteMany({ branchID: branchID });
    await employeeModel.updateMany(
      {
        "permitted.branchID": branchID,
      },
      {
        $pull: { permitted: { branchID: branchID } },
      }
    );
    await cartModel.deleteMany({ branchID: branchID });
    await category.deleteMany({ branchID: branchID });
    await coupon.deleteMany({ branchID: branchID });
    await dish.deleteMany({ branchID: branchID });
    await expense.deleteMany({ branchID: branchID });
    await print.deleteMany({ branchID: branchID });
    await vendor.deleteMany({ branchID: branchID });
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(500).send(false);
  }
};
const getAllBranch = async (req, res) => {
  try {
    const data = await branchModel.aggregate([
      {
        $lookup: {
          from: "subscriptions", // Name of the subscription model collection
          localField: "_id", // Field from the branch model
          foreignField: "branchID", // Field from the subscription model
          as: "subscriptions",
        },
      },
      {
        $unwind: "$subscriptions", // If there can be multiple subscriptions for a branch
      },
      {
        $lookup: {
          from: "restaurants", // Assuming the name of the restaurant model collection
          localField: "subscriptions.res_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $match: {
          "subscriptions.deleteStatus": "false",
        },
      },
      {
        $sort: { "subscriptions.endDate": 1 }, // Sort by subscription end date in descending order
      },
    ]);
    const transformedData = data.map((branch) => {
      const subscription = branch.subscriptions;

      return {
        _id: subscription._id,
        streetAddress: branch.streetAddress,
        city: branch.city,
        res_id: subscription.res_id,
        res_name: branch.restaurant[0].res_name,
        branch_name: branch.branch_name,
        branchID: branch._id,
        isActive: subscription.isActive,
        subscriptionStart: new Date(subscription.startDate).toISOString(),
        subscriptionEnd: new Date(subscription.endDate).toISOString(),
        amount: subscription.previousSubscriptions[0].price,
        payment_time: new Date(
          subscription.previousSubscriptions[0].payment_time
        ).toISOString(),
        transaction_id: subscription.previousSubscriptions[0].transactionID,
        payment_method: "card", // Assuming a default value, modify as needed
        payment_status: subscription.previousSubscriptions[0].paymentStatus
          ? "Paid"
          : "Not Paid",
      };
    });

    res.status(200).json(transformedData);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const addTables = async (req, res) => {
  try {
    const { branchID } = req.params;
    const { number, capacity, location } = req.body;
    console.log(number, capacity, location);
    const branch = await branchModel.findById({ _id: branchID });
    if (!branch) {
      responseError(res, 404, error);
    } else {
      const qrCodeData =
        "/onsite-order/restaurant/" +
        branch.res_id +
        "/branch/" +
        branch._id +
        "/table/" +
        number;
      const updateTable = await branchModel.findByIdAndUpdate(
        branch._id,
        {
          $push: {
            tables: {
              number: number,
              capacity: capacity,
              location: location,
              qrCodeData: qrCodeData,
            },
          },
        },
        { new: true }
      );
      console.log("updateTable", updateTable);
      res.status(200).send(updateTable);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const getBranchesTable = async (req, res) => {
  const { branchID } = req.params;
  try {
    const branches = await branchModel
      .findOne({ _id: branchID })
      .select("tables")
      .lean(); // Using lean() to convert mongoose documents to plain JavaScript objects
    if (!branches) {
      responseError(res, 404, "No branches found");
    }
    if (branches?.tables && Array.isArray(branches.tables)) {
      // Preprocess each branch before sending it to the frontend
      const modifiedTables = branches.tables.map((table) => {
        if (table.qrCodeData) {
          table.qrCodeData = process.env.LINK + table.qrCodeData;
        }
        return table;
      });
      res.status(200).send(modifiedTables);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const barnchTableDelete = async (req, res) => {
  const { branchID, number } = req.params;

  try {
    const branch = await branchModel.findOneAndUpdate(
      { _id: branchID }, // Find the branch containing the table with number = 2
      { $pull: { tables: { number: number } } }, // Remove the table with number = 2
      { new: true }
    );
    res.status(200).send(true);
    console.log("Branch after deletion:", branch);
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllBranchForDev = async (req, res) => {
  try {
    const { res_id } = req.params;
    const resDetails = await restaurantModel.findById({ _id: res_id });
    const branchList = await branchModel
      .find({
        res_id: res_id,
        deleteStatus: false,
      })
      .select(
        "_id branch_name streetAddress city stateProvince country paymentTypes"
      );

    res.status(200).send({
      restaurantDetails: resDetails,
      branches: branchList,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const singleBranchDataForDev = async (req, res) => {
  try {
    const { branchID } = req.params;
    const data = await branchModel
      .findById(branchID)
      .select(
        "branch_name streetAddress city stateProvince country paymentTypes"
      );
    const transactionData = await subscriptionModel
      .findOne({ branchID: branchID })
      .select("previousSubscriptions");
    if (data && transactionData) {
      res.status(200).send({
        branchDetails: data,
        transactionData,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const showBusinessHours = async (req, res) => {
  const { res_id, branchID } = req.params;

  try {
    const data = await branchModel.findById({ _id: branchID }, "shift").lean();
    console.log(data);
    res.status(200).send(data.shift);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting business hours");
  }
};

const modifyBusinessHours = async (req, res) => {
  const { res_id, branchID } = req.params;
  //const {data} = req.body;
  console.log(req.body, "this is the data in controller");

  try {
    const data1 = await branchModel.findByIdAndUpdate(
      { _id: branchID },
      { shift: req.body },
      { new: true }
    );
    console.log(data1);
    res.status(200).send(true);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting business hours");
  }
};

const showPaymentType = async (req, res) => {
  const { res_id, branchID } = req.params;

  try {
    const data = await branchModel
      .findById({ _id: branchID })
      .select("paymentTypes , takewayCharge , deliveryCharge")
      .lean();
    console.log(data);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting business hours");
  }
};

const modifyPaymentType = async (req, res) => {
  const { res_id, branchID } = req.params;
  const { paymentTypes, takewayCharge, deliveryCharge } = req.body;

  console.log(req.body);
  try {
    const data = await branchModel.findByIdAndUpdate(
      { _id: branchID },
      { paymentTypes, takewayCharge, deliveryCharge },
      { new: true }
    );
    console.log(data);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting business hours");
  }
};

const getBranchDetail = async (req, res) => {
  const { branchID } = req.params;

  try {
    const data = await branchModel
      .findOne({
        _id: branchID,
        deleteStatus: "false",
      })
      .select(
        "branch_name streetAddress city stateProvince postalCode country "
      );

    if (data) {
      res.status(200).send(data);
    } else {
      responseError(res, 404);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting business hours");
  }
};

// update branch info
const updateBranch = async (req, res) => {
  const { branchID } = req.params;
  const {
    branch_name,
    city,
    country,
    postalCode,
    stateProvince,
    streetAddress,
  } = req.body;

  try {
    let updatedData = await branchModel.findByIdAndUpdate(
      branchID,
      {
        branch_name,
        city,
        country,
        postalCode,
        stateProvince,
        streetAddress,
      },
      { new: true }
    );

    res.status(200).send(updatedData);
  } catch (err) {
    console.log("Error In Updating Data", err);
    return res.status(401).json({
      Error: "Error In updating Data",
    });
  }
};

const getAllRestaurantOf_A_City = async (req, res) => {
  try {
    const { city } = req.params;
    let list = await branchModel
      .find({ deleteStatus: false, city: { $regex: city, $options: "i" } })
      .populate("res_id");

    // Transform the data
    const response = list.map((item) => ({
      branchID: item?._id,
      res_id: item?.res_id?._id,
      res_name: item?.res_id?.res_name,
      res_email: item?.res_id?.res_email,
      res_mobile: item?.res_id?.res_mobile,
      res_Owner_Name: item?.res_id?.res_Owner_Name,
      res_Owner_email: item?.res_id?.res_Owner_email,
      res_Owner_mobile: item?.res_id?.res_Owner_mobile,
      res_Owner_streetAddress: item?.res_id?.res_Owner_streetAddress,
      res_Owner_city: item?.res_id?.res_Owner_city,
      res_Owner_stateProvince: item?.res_id?.res_Owner_stateProvince,
      res_Owner_postalCode: item?.res_id?.res_Owner_postalCode,
      res_Owner_country: item?.res_id?.res_Owner_country,
      img: item?.res_id?.img,
      branch_name: item?.branch_name,
      streetAddress: item?.streetAddress,
      city: item?.city,
      stateProvince: item?.stateProvince,
      postalCode: item?.postalCode,
      country: item?.country,
      deleteStatus: item?.deleteStatus,
      paymentTypes: item?.paymentTypes,
      takewayCharge: item?.takewayCharge,
      deliveryCharge: item?.deliveryCharge,
      tables: item?.tables,
    }));

    res.status(200).send({restaurants:response});
  } catch (error) {
    responseError(res,500)
  }
};

const checkBusinessHours  = async (req, res) => {
  try {
    const {branchID,res_id}= req.params;
    const  businessHour= await branchModel.findOne({ _id : branchID , res_id : res_id});
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // Get current day
    const today = businessHour.shift[dayOfWeek];
    if(isTimeBetween(today.openingTime,today.closingTime))//check if it is open
    {
      res.status(200).send({available : true});

    }else{
      res.status(200).send({available : false});
    }
  } catch (error) {
    responseError(res,500,error);
    
  }
}


function isTimeBetween(startTime, endTime) {
  // Get current time in local time zone
  var now = new Date();
  var bdTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));

console.log(bdTime)
  var currentTime = bdTime.getHours() + bdTime.getMinutes() / 60; // Convert current time to hours

  // Parse start time
  var startParts = startTime.split(":");
  var startHour = parseInt(startParts[0]);
  var startMinutes = parseInt(startParts[1]);
  var startTime = startHour + startMinutes / 60; // Convert start time to hours

  // Parse end time
  var endParts = endTime.split(":");
  var endHour = parseInt(endParts[0]);
  var endMinutes = parseInt(endParts[1]);
  var endTime = endHour + endMinutes / 60; // Convert end time to hours

  // Check if current time is between start and end time
  return currentTime >= startTime && currentTime <= endTime;
}

const facebook_appID_pageID_saved = async (req,res)=>{
  try {
    const {res_id,branchID}= req.param;
    const {appID, pageID} = req.body;
    const data = await new facebookAppIDModel({res_id,branchID,appID, pageID}).save();
    res.status(200).send(true);
  } catch (error) {
    responseError(res,500,error,"internal server error");
  }
}

module.exports = {
  addTables,
  getAllBranch,
  createBranch,
  deleteBranch,
  getAllBranchForDev,
  singleBranchDataForDev,
  showBusinessHours,
  modifyBusinessHours,
  showPaymentType,
  modifyPaymentType,
  getBranchesTable,
  barnchTableDelete,
  getBranchDetail,
  updateBranch,
  getAllRestaurantOf_A_City,
  checkBusinessHours,
  facebook_appID_pageID_saved,
};
