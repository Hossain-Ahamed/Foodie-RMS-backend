const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createUserAccount = ({ email, password }) => {
  try {
    admin.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
};

module.exports = createUserAccount;
