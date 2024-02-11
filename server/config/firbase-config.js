const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createUserAccount = ({ email, password ,phoneNumber, displayName}) => {
  try {
   const create = admin.auth().createUser({
      email,
      password,
      phoneNumber,
      displayName,

    });
  return create;
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
};

module.exports = createUserAccount;
