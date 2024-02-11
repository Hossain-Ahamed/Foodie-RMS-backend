const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createUserAccount = ({ email, password}) => {
  try {
   const create = admin.auth().createUser({
      email,
      password,
    });
  return create;
  } catch (error) {
    console.log("Firebase serive :: createUser :: error", error);
  }
};

const deleteUser = ({uid})=>{
  try {
    const deleteData = admin.auth().deleteUser(uid);
   return deleteData;
   } catch (error) {
     console.log("Firebase serive :: createUser :: error", error);
   }
}


const updatePassword = ({uid, password})=>{
  try {
    const updatePass = admin.auth().updateUser(uid, {
      password: password,
    })
   return updatePass;
   } catch (error) {
     console.log("Firebase serive :: createUser :: error", error);
   }
}

module.exports = {
  createUserAccount,
  deleteUser,
  updatePassword
};
