const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createUserAccount = ({ name, email, password }) => {
  try {
    const create = admin.auth().createUser({
      email,
      password,
    });
    return create;
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
  try {
    sendMail({
      email: email,
      subject: "Receive your password",
      message: `Hello ${name}, this is your email: ${email} and password: ${password} for log in`,
    });
    res.status(201).json({
      success: true,
      message: `please check your email:- ${email}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const deleteUser = ({ uid }) => {
  try {
    const deleteData = admin.auth().deleteUser(uid);
    return deleteData;
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
};

const updatePassword = ({ uid, password }) => {
  try {
    const updatePass = admin.auth().updateUser(uid, {
      password: password,
    });
    return updatePass;
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
};

module.exports = {
  createUserAccount,
  deleteUser,
  updatePassword,
};
