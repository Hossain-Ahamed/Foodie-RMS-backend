const admin = require("firebase-admin");

const serviceAccount1 = require("./serviceAccount.json");
const serviceAccount2 = require("../config-e-res/E_ServiceAccount.json");

const admin1 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount1),
}, 'admin1');

const admin2 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount2),
}, 'admin2');

const getUserByEmailAddress = (email)=>{
  try {
    return admin1.auth().getUserByEmail(email)
  } catch (error) {
    console.log("Firebase service :: createUser :: error", error);
  }
}
const createUserAccount = ({ name, email, password }) => {
  try {
    return admin1.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    console.log("Firebase service :: createUser :: error", error);
  }
};

const deleteUser = ({ uid }) => {
  try {
    const deleteData = admin1.auth().deleteUser(uid);
    return deleteData;
  } catch (error) {
    console.log("Firebase service :: deleteUser :: error", error);
  }
};
const getUserByEmail =async (email)=>{
  try {
 
    return  admin1.auth().getUserByEmail(email);
  } catch (error) {
    console.log("Firebase service :: updatePassword :: error", error);
  }
}
const updatePassword = ( uid, password ) => {
  try {
    const updatePass = admin1.auth().updateUser(uid, {
      password: password,
    });
    return updatePass;
  } catch (error) {
    console.log("Firebase service :: updatePassword :: error", error);
  }
};

const E_createUserAccount = ({ name, email, password }) => {
  try {
    return admin2.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    console.log("Firebase service :: E_createUserAccount :: error", error);
  }
};

const E_deleteUser = ({ uid }) => {
  try {
    const deleteData = admin2.auth().deleteUser(uid);
    return deleteData;
  } catch (error) {
    console.log("Firebase service :: E_deleteUser :: error", error);
  }
};

const E_updatePassword = (uid, password) => {
  try {
    const updatePass = admin2.auth().updateUser(uid, {
      password: password,
    });
    return updatePass;
  } catch (error) {
    console.log("Firebase service :: E_updatePassword :: error", error);
  }
};


module.exports = {
  createUserAccount,
  getUserByEmail,
  deleteUser,
  updatePassword,
  E_createUserAccount,
  E_deleteUser,
  E_updatePassword,
  getUserByEmailAddress
};
