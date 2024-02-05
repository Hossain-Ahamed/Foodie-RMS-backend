const admin = require("firebase-admin");

const createUserAccount = ({ email, password }) => {
  try {
    admin.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    console.log("Appwrite serive :: getCurrentUser :: error", error);
  }
};

module.exports = createUserAccount;
