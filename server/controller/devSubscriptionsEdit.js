const Subscription = require("../model/subscriptionModel");
const restaurantModel = require("../model/restaurantModel.js");
const sendMail = require("../utils/sendEmail.js");
const { getAllBranch } = require("../controller/branchController.js");

const deleteBranchFromDevPaymentList = async (req, res) => {
  try {
    const _id = req.params._id;
    await Subscription.findByIdAndUpdate(
      _id,
      {
        deleteStatus: true,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const deactivateBranchFromDevPaymentList = async (req, res) => {
  try {
    const _id = req.params._id;
    const { status } = req.body;
    const newStatus = status ? false : true;
    await Subscription.findByIdAndUpdate(
      _id,
      {
        isActive: newStatus,
      },
      { new: true }
    );
    res.status(200).send(true);
  } catch (err) {}
};

const notifyOwnerFromDev = async (req, res) => {
  try {
    const { streetAddress, city, res_id, subscriptionEnd,branch_name } = req.body.data;
    const _id = req.params._id;
    const restaurant = await restaurantModel.findOne({ _id: res_id });
    if (restaurant) {
      sendMail({
        email: restaurant.res_email,
        subject: "Subscription Renewal Notice",
        to: restaurant.res_email,
        message: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding:0;Margin:0">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>Renew Subscription</title>
            <!--[if (mso 16)]><style type="text/css">a {text-decoration: none;} </style><![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG></o:AllowPNG><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
            <style type="text/css">
                #outlook a { padding:0;}
                .ExternalClass { width:100%;}
                .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div { line-height:100%;}
                .es-button { mso-style-priority:100!important; text-decoration:none!important;}
                a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}
                .es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}
                .es-button-border:hover a.es-button, .es-button-border:hover button.es-button { background:#ffffff!important;}
                .es-button-border:hover { background:#ffffff!important; border-style:solid solid solid solid!important; border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;}
                @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:20px!important; text-align:center } h2 { font-size:16px!important; text-align:left } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:20px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:16px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:10px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:14px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
                @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
            </style>
        </head>
        
        <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
            <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA">
                <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
                    <tr style="border-collapse:collapse">
                        <td valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr style="border-collapse:collapse">
                                    <td class="es-adaptive" align="center" style="padding:0;Margin:0">
                                        <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3d5ca3;width:600px" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center">
                                            <tr style="border-collapse:collapse">
                                                <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#EF5130" bgcolor="#3d5ca3" align="left">
                                                    <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:100px" valign="top"><![endif]-->
                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                        <tr style="border-collapse:collapse">
                                                            <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:100px">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;font-size:0px">
                                                                            <img src="https://i.ibb.co/k9Bbgpg/brand-icon.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="93" height="93">
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <!--[if mso]></td><td style="width:20px"></td><td style="width:440px" valign="top"><![endif]-->
                                                    <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                                        <tr style="border-collapse:collapse">
                                                            <td align="left" style="padding:0;Margin:0;width:440px">
                                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center" style="padding:0;Margin:0;padding-bottom:15px;padding-top:30px">
                                                                            <h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#f6eceb"><b>Foodie Restaurant Management System</b></h1>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                <tr style="border-collapse:collapse">
                                    <td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center">
                                        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tr style="border-collapse:collapse">
                                                <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top" bgcolor="transparent" align="left">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                                <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                                                            <img src="https://i.ibb.co/87k6Kw6/warn.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="175" height="208">
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                                                            <h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:red"><b>Renew Your Subscription</b></h1>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="left" style="padding:0;Margin:0;padding-right:35px;padding-left:40px">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px;text-align:left">
                                                                                Dear <b> ${restaurant.res_Owner_Name} </b>,
                                                                                <br><br>Your subscription for <b>  ${branch_name} : ${streetAddress}, ${city} : ${restaurant.res_name}</b> to the Foodie Restaurant Management System will expire in <b> ${new Date(subscriptionEnd).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</b> .To ensure uninterrupted access to our services and continue enjoying the benefits of Foodie, we kindly request you to renew your subscription at your earliest convenience.
        
        
                                                                                <br><br>
        Thank you for being a valued member of our community. We look forward to serving you for another term.
                                                                                <br><br>
                                                                               Warm Regards,<br><b>Foodie Team</b>
                                                                              
                                                                                <br><br><br>
                                                                                <span style="color:red">NB: If you have received this email in error, kindly notify us immediately to rectify the situation. Please delete this email and all accompanying documents promptly. Your cooperation in this matter is greatly appreciated.</span>
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
        `,
      });
    }
    res.status(200).send(true);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

module.exports = {
  deleteBranchFromDevPaymentList,
  deactivateBranchFromDevPaymentList,
  notifyOwnerFromDev,
};
