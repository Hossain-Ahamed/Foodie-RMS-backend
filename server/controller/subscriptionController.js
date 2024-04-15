const Subscription = require("../model/subscriptionModel");
const branchModel = require("../model/branchModel");
const { createUserAccount } = require("../config/firbase-config.js");
const restaurantModel = require("../model/restaurantModel");
const packageModel = require("../model/subcripstionPackages");
const createClient = require("./clientController.js");
const sendMail = require("../utils/sendEmail.js");
const uuid = require("uuid");
const { responseError } = require("../utils/utility.js");
const mongoose = require("mongoose");
const subscriptionModel = require("../model/subscriptionModel");
const subcripstionPackages = require("../model/subcripstionPackages");
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51NxHA3BTo76s02AIpHmn0d0gRVmFKqznGxcwKiHQ1eslceVjz5cQC7jKn3a8GnsQ0IoDhxNGZoRZPDXKEzYQQErN00aE7u24Le"
);

// payment gateway
const CreatePaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    // console.log(price, process.env.PK_KEY);
    const ammount = parseInt(price * 100);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ammount,
      currency: "usd",

      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    // console.log(1, e);
    // Bad Request: Server error or client sent an invalid request
    res
      .status(500)
      .send({ message: "Bad Request: Server error or invalid request" });
  }
};

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { res_id, packageType } = req.body;
    const { branchID } = req.params;
    let startDate = Date.now();
    const existingSubscription = await Subscription.findOne({
      branchID: branchID,
    });
    if (existingSubscription) {
      return res.status(400).json({ error: "Subscription already exist" });
    }
    let endDate;
    switch (packageType) {
      case "Starter":
        endDate = startDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Pro":
        endDate = startDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Enterprise":
        endDate = startDate + 12 * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return res.status(400).json({ error: "Invalid package type" });
    }
    const res_Id_needed = await branchModel.findOne({ _id: branchID });

    const newSubscription = new Subscription({
      res_id: res_Id_needed.res_id,
      branchID,
      packageType,
      startDate,
      endDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      previousSubscriptions: [
        {
          packageType: packageType,
          startDate: startDate,
          endDate: endDate,
          payment_time: 0,
          price: 0,
          transactionID: "0000000000000000000",
        },
      ],
    }).save();
    res.status(201).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//give subscription payment Details

const getPaymentDetails = async (req, res) => {
  try {
    const { branchID } = req.params;
    const existingSubscription = await Subscription.findOne({
      branchID: branchID,
    });
    const packages = await packageModel.findOne({
      packageType: existingSubscription.packageType,
    });
    if (!existingSubscription) {
      return res.status(404).json({ error: "No such Branch ID" });
    }
    const Data = {
      Details: {
        _id: existingSubscription._id,
        res_id: existingSubscription.res_id,
        branchID: existingSubscription.branchID,
        packageType: existingSubscription.packageType,
      },
      price: parseFloat(packages.finalPrice),
    };
    res.status(200).json(Data);
  } catch (error) {
    console.log("Error in getting Payment details", error);
  }
};

const getPaymentDetailsForExtendAndAddBranch = async (req, res) => {
  try {
    const { branchID } = req.params;
    const existingSubscription = await Subscription.findOne({
      branchID: branchID,
    });
    if (!existingSubscription) {
      return res.status(404).json({ error: "No such Branch ID" });
    }
    const latest_seleted_non_paid_package_index = existingSubscription.previousSubscriptions.length - 1;
    const latest_seleted_non_paid_package = existingSubscription.previousSubscriptions[latest_seleted_non_paid_package_index];
    console.log(latest_seleted_non_paid_package);
    if(latest_seleted_non_paid_package.paymentStatus){
      responseError(res,404,"You have already paid for this Package");
      return ;
    }
    const packages = await packageModel.findOne({
      packageType: latest_seleted_non_paid_package.packageType,
    });
    

    const Data = {
      Details: {
        _id: existingSubscription._id,
        res_id: existingSubscription.res_id,
        branchID: existingSubscription.branchID,
        packageType: latest_seleted_non_paid_package.packageType,
      },
      price: parseFloat(packages.finalPrice),
    };
    res.status(200).json(Data);
  } catch (error) {
    console.log("Error in getting Payment details", error);
  }
};

//update packages data after payment

const updatePackageAfterPayment = async (req, res) => {
  const { subscriptionID, packageType, transactionID, price } = req.body;
  const existingSubscription = await Subscription.findById(subscriptionID);
  if (!existingSubscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }
  let startdate = Date.now();
  let enddate;
  switch (packageType) {
    case "Starter":
      enddate = startdate + 3 * 30 * 24 * 60 * 60 * 1000;
      break;
    case "Pro":
      enddate = startdate + 6 * 30 * 24 * 60 * 60 * 1000;
      break;
    case "Enterprise":
      enddate = startdate + 12 * 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return res.status(400).json({ error: "Invalid package type" });
  }
  // existingSubscription.startDate = startdate;
  // existingSubscription.endDate = enddate;
  // existingSubscription.isActive = true;
  // existingSubscription.previousSubscriptions[0].startDate = startdate;
  // existingSubscription.previousSubscriptions[0].endDate = enddate;
  // existingSubscription.previousSubscriptions[0].price = price;
  // existingSubscription.previousSubscriptions[0].transactionID = transactionID;
  // existingSubscription.previousSubscriptions[0].paymentStatus = true;
  const subscriptionUpdate = await Subscription.findByIdAndUpdate(
    subscriptionID,
    {
      startDate: startdate,
      endDate: enddate,
      isActive: true,
      previousSubscriptions: [
        {
          startDate: startdate,
          endDate: enddate,
          payment_time: Date.now(),
          price: price,
          paymentStatus: true,
          transactionID: transactionID,
        },
      ],
    }
  );
  const existingRestaurant = await restaurantModel.findById(
    existingSubscription.res_id
  );
  if (!existingRestaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  const password = uuid.v4().slice(0, 8);
  const email = existingRestaurant.res_Owner_email;
  const name = existingRestaurant.res_Owner_Name;

  createUserAccount({ name, email, password })
    .then((res) => {
      console.log(res?.uid);
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
     <td align="left" style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px"><strong>Email:</strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${email}<br><strong>Password</strong>&nbsp;&nbsp;${password}</p></td> </tr><tr style="border-collapse:collapse"><td style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:red;font-size:16px;margin-top:1.5rem">NB: Please do not share this information with anyone.</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`,
        });
      } catch {
        (e) => {
          console.log(e);
        };
      }
    })
    .catch((e) => console.log(e));
  createClient({ email, password });

  res.status(201).json({
    success: true,
    message: `please check your email:- ${email}`,
  });
};

const updatePackageAfterPaymentForNewBranch = async (req, res) => {
  const { subscriptionID, packageType, transactionID, price } = req.body;
  const existingSubscription = await Subscription.findById(subscriptionID);
  if (!existingSubscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }
  
  let startdate = existingSubscription.startDate;
  if(existingSubscription?.endDate < startdate ||existingSubscription?.endDate  == 0){
    startdate = Date.now();
  }
  const Subscription_package_data = await subcripstionPackages.findOne({
    packageType : packageType,
  });
  if (!Subscription_package_data) {
    return res.status(400).json({ error: "Subscription package not found" });
  }
  let enddate = startdate + Subscription_package_data?.duration * 30 * 24 * 60 * 60 * 1000;

 /* existingSubscription.startDate = startdate;
  existingSubscription.endDate = enddate;
  existingSubscription.isActive = true;
  
  
  // Update previousSubscriptions array
  existingSubscription.previousSubscriptions.forEach(subscription => {
    if (subscription.packageType == packageType && subscription.paymentStatus == false) {
      subscription.startDate = startdate;
      subscription.endDate = enddate;
      subscription.transactionID = transactionID;
      subscription.paymentStatus = true;
      subscription.payment_time = Date.now();
      subscription.price = Subscription_package_data.finalPrice;

    }
  });
  
  console.log(existingSubscription); // Output updated data*/




  const subscriptionUpdate = await Subscription.updateOne(
    { 
      _id: subscriptionID, 
      "previousSubscriptions.packageType": packageType, 
      "previousSubscriptions.paymentStatus": false 
    },
    { 
      $set: {
        'startDate': startdate ,
        'endDate': enddate ,
        "isActive": true ,
        "previousSubscriptions.$.startDate": startdate,
        "previousSubscriptions.$.endDate": enddate,
        "previousSubscriptions.$.transactionID": transactionID,
        "previousSubscriptions.$.paymentStatus": true,
        "previousSubscriptions.$.payment_time": Date.now(),
        "previousSubscriptions.$.price": Subscription_package_data?.finalPrice,
      }
    }
  );
  




  res.status(201).json({
    success: true,
  });
};


//when user expend their subscription
const extendSubscription = async (req, res) => {
  try {
    const { subscriptionID, packageType, transactionID, price } = req.body;

    const existingSubscription = await Subscription.findById(subscriptionID);
    if (!existingSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    let newEndDate;
    switch (packageType) {
      case "Starter":
        newEndDate =
          existingSubscription.endDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Pro":
        newEndDate =
          existingSubscription.endDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Enterprise":
        newEndDate =
          existingSubscription.endDate + 12 * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return res.status(400).json({ error: "Invalid package type" });
    }
    let secondaryEndDate = existingSubscription.endDate;
    existingSubscription.endDate = newEndDate;
    existingSubscription.packageType = packageType;
    existingSubscription.updatedAt = Date.now();
    previousSubscriptionsDetails = {
      packageType: packageType,
      startDate: secondaryEndDate,
      endDate: newEndDate,
      payment_time: Date.now(),
      price: price,
      paymentStatus: true,
      transactionID: transactionID,
    };
    existingSubscription.previousSubscriptions.push(
      previousSubscriptionsDetails
    );
    await existingSubscription.save();
    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getSubscriptionPurchaseHistory = async (req, res) => {
  try {
    const { res_id } = req.params;
    if (!res_id) {
      return res.status(404).send({ error: "Res_id is required." });
    }

    const subscriptions = await subscriptionModel.find({
      res_id: res_id,
      deleteStatus: "false"
    })
    .populate({
      path: 'res_id',
      select: 'res_name _id'
    })
    .populate({
      path: 'branchID',
      select: 'branch_name _id'
    })
    .select('_id previousSubscriptions res_id branchID');

    // Flattening previous subscriptions and formatting data
    let formattedData = [];
    subscriptions.forEach(subscription => {
      subscription.previousSubscriptions.forEach(prevSub => {
        formattedData.push({
          res_id: subscription.res_id._id,
          res_name: subscription.res_id.res_name,
          branch_name: subscription.branchID.branch_name,
          branchID: subscription.branchID._id,
          subscriptionStart: new Date(prevSub.startDate).toISOString(),
          subscriptionEnd: new Date(prevSub.endDate).toISOString(),
          amount: prevSub.price,
          payment_time: new Date(prevSub.payment_time).toISOString(),
          transaction_id: prevSub.transactionID
        });
      });
    });

    // Sort by payment time
    formattedData.sort((a, b) => new Date(b.payment_time) - new Date(a.payment_time));

    res.status(200).send(formattedData);
  } catch (error) {
    console.error("Error in getSubscriptionPurchaseHistory:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};



const subscription_Duration_For_All_Branches = async (req, res) => {
  try {
    const { res_id } = req.params;
    const subscriptions = await subscriptionModel.find({
      res_id: res_id,
      deleteStatus: "false"
    })
    .populate({
      path: 'res_id',
      select: 'res_name _id'
    })
    .populate({
      path: 'branchID',
      select: 'branch_name _id'
    })
    .select('_id startDate endDate res_id branchID');

    // Transforming the result array to match the desired output format
    const transformedData = subscriptions.map(subscription => ({
      _id: subscription._id,
      subscriptionStart: subscription.startDate,
      subscriptionEnd: subscription.endDate,
      res_name: subscription.res_id.res_name,
      res_id: subscription.res_id._id,
      branchID: subscription.branchID._id,
      branch_name: subscription.branchID.branch_name
    }));

    res.status(200).send(transformedData);
  } catch (e) {
    responseError(res, 500, e);
  }
};

const getTransactionForSingleRestaurant = async(req,res)=>{
  try {
    const {res_id,branchID} = req.params;

    const transaction = await subscriptionModel.findOne({res_id:res_id ,branchID : branchID}).sort({date:-1}).populate("res_id branchID");
    if(!transaction){
      return res.status(404).json({message:"No transaction found with provided details."});
    
    } else{
      res.status(200).send({res_id:transaction?.res_id?._id,
      res_name:transaction?.res_id?.res_name,
      branchID:transaction?.branchID?._id,
      branch_name:transaction?.branchID?.branch_name,
      transactions:transaction?.previousSubscriptions
    })
    }
  
  } catch (error) {
    
  }
}





module.exports = {
  createSubscription,
  extendSubscription,
  CreatePaymentIntent,
  getPaymentDetails,
  updatePackageAfterPayment,
  getSubscriptionPurchaseHistory,
  subscription_Duration_For_All_Branches,
  updatePackageAfterPaymentForNewBranch,
  getPaymentDetailsForExtendAndAddBranch,
  getTransactionForSingleRestaurant,
};
