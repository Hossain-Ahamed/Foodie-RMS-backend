const JWT = require("jsonwebtoken");

function checkPermission(allowedRoles) {
  return async (req, res, next) => {
    let user;
    const admintoken = req.cookies._at;
    // console.log('check token');
    if (!admintoken) {
      return res.status(401).send({
        msg: "unauthorized",
      });
    }
    JWT.verify(admintoken, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          msg: "unauthorized",
        });
      }
      //console.log('check token   ', decoded._id);
      user = decoded;

    });
    const { role } = await adminModel.findOne({ _id: user._id }).select('role');
    //console.log(role);


    //console.log(user)
    if (!user || !user.role || !allowedRoles.includes(user.role) || !role || !allowedRoles.includes(role)) {
      return res.sendStatus(403); // Forbidden
    }

    req.role = role;
    req.adminID = user?._id;
    next();
  };
}

module.exports = {
  checkPermission
};