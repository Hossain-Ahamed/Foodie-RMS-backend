const { Mutex } = require("async-mutex");
const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");
const JWT = require("jsonwebtoken");
const membershipModel = require("../model/membershipModel");
const mutex = new Mutex();
const axios = require("axios");
const { E_updatePassword } = require("../config/firbase-config");
const signUp = async (req, res) => {
  try {
    const { name, email, firebase_UID, password, phone } = req.body;

    try {
      const checkUser = await userModel.findOne({ email: email });
      if (!checkUser) {
        const createUser = await new userModel({
          name,
          email,
          firebase_UID,
          password,
          phone,
        }).save();
        res.status(200).send(true);
      } else {
        const updateUser = await userModel.findByIdUpdate(checkUser?._id, {
          firebase_UID,
        });
      }
    } catch (error) {
      responseError(res, 500, "internal server error", error);
    }
  } catch (error) {
    responseError(res, 500, "did not get value", error);
  }
};
const signIn = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    responseError(res, 200, "Invalid Email or Password");
  } else {
    res.status(200).send(user);
  }
};
const JWTtoken = async (req, res) => {
  const { name, email, firebase_UID, password, phone, imgURL } = req.body;
  try {
    const release = await mutex.acquire();

    let user = await userModel.findOne({ email: email });
    if (!user) {
      user = await new userModel({
        name,
        email,
        firebase_UID,
        password,
        phone,
      }).save();
    }

    const accesstoken = await JWT.sign(
      { _id: user?._id, email: email, firebase_UID: firebase_UID },
      process.env.JWT_SECRET_TOKEN
    );

    res.cookie("_ut", accesstoken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).send({
      success: true,
      message: "Logging in successfully",
      user: {
        _id: user?._id,
        name: user?.name,
        phone: user?.phone,
        email: user?.email,
        address: user?.address,
        imgURL: user?.imgURL,
        gender: user?.gender,
      },
    });
    release(); // Release the mutex lock
  } catch (error) {
    responseError(res, 500, "Internal server error");
  }
};

const checktoken = (req, res, next) => {
  const id = req.cookies._ut;
  const userId = req.params.userId;
  if (!id) {
    return res.status(401).send({
      msg: "unauthorized",
    });
  }
  JWT.verify(id, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        msg: "unauthorized",
      });
    }
    if (userId !== decoded._id) {
      return res.status(401).send({
        msg: "unauthorized",
      });
    }

    req.data = req.body;
    next();
  });
};
const signout = async (req, res) => {
  try {
    res.clearCookie("_ut");
    res.status(201).send(true);
  } catch {
    (e) => {
      res.status(401).send(false);
    };
  }
};
const getProfile = async (req, res) => {
  try {
    // const release = await mutex.acquire();
    const email = req.params.email;
    const user = await userModel.findOne({ email: email }, "-password");
    if (!user) {
      responseError(res, 401, null, "User not found");
      return;
    }

    res.status(200).send({
      _id: user?._id,
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      address: user?.address,
      imgURL: user?.imgURL,
      gender: user?.gender,
    });
    // release();
  } catch (error) {
    responseError(res, 500, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    let { name, phone, gender, img } = req.body;
    const user = await userModel.findOne({ email: email });

    if (user) {
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          name,
          phone,
          gender,
          imgURL: img,
        },
        { new: true }
      );

      res.status(200).send(updatedUser);
    } else {
      res.status(404).send({
        message: "user Not Found",
        status: false,
      });
    }
  } catch (error) {
    responseError(res, 500, error, "Internal Server Error");
  }
};

const updateProfileAddress = async (req, res) => {
  try {
    const { email } = req.params;
    const { streetAddress, city, stateProvince, postalCode, country } =
      req.body;
    //const _id,address = req.body;
    //   {
    //     "streetAddress": "J A M T O L A",
    //     "city": "Narayanganj",
    //     "stateProvince": "Dhaka",
    //     "postalCode": "1400",
    //     "country": "Bangladesh"
    // }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).send({
        message: "User not found!",
        status: false,
      });
    } else {
      await userModel.findByIdAndUpdate(user._id, {
        address: {
          streetAddress,
          city,
          stateProvince,
          postalCode,
          country,
        },
      });

      res.status(200).send({ message: "updated successfully" });
    }
  } catch (e) {
    responseError(res, 500);
  }
};

const searchUserByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res
        .status(200)
        .send([{ _id: "null", name: "Anonymous", phone: "000-000-000" }]);
    }
    const regexPattern = new RegExp(phone, "i");
    const users = await userModel
      .find({ phone: { $regex: regexPattern } })
      .select("_id name phone")
      .limit(8)
      .exec();
    if (users.length == 0) {
      return res
        .status(200)
        .send([{ _id: "null", name: "Anonymous", phone: "000-000-000" }]);
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewMemberShipForUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found!");
    else {
      const memberShip = await membershipModel
        .find({ memberShip: user?._id })
        .populate("res_id");
      if (memberShip.length == 0) {
        return res.status(200).send({});
      }
      const formattedData = memberShip.map((item) => ({
        res_name: item?.res_id?.res_name || "",
        res_img: item?.res_id?.img || "",
      }));
      res.status(200).send(formattedData);
    }
  } catch (error) {
    responseError(res, 500, error, "Internal server error");
  }
};

const generateOTP = () => {
  const characters = "0123456789";
  return Array.from(
    { length: 4 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};
const ReqForOTP = async (req, res) => {
  try {
    const { email } = req.params;
    const check_user = await userModel.findOne({ email });
    if (!check_user) {
      return res.status(200).send(true);
    }
    if (!check_user?.phone) {
      return responseError(res, 404, {}, "User Does Not Have Phone Number");
    }
    const OTP = generateOTP();
    const phone = check_user?.phone;
    let cleanedNumber = phone.replace(/^\+88/, "");

    let message = `Hello ${check_user?.name}, %0AYour OTP for changing password is ${OTP}%0ANever share your OTP with anyone.%0A-FOODIE`;

    await userModel.findByIdAndUpdate(check_user?._id, { OTP }, { new: true });
    const smsResponse = await axios.post(
      `https://bulksmsbd.net/api/smsapi?api_key=${process.env.BULK_MESSAGE_API}&type=text&number=${cleanedNumber}&senderid=${process.env.BULK_MESSAGE_SENDER}&message=${message}`
    );

    console.log(smsResponse.data);
    res.status(200).send(true);
  } catch (error) {
    responseError(res, 500, error, "Server Error");
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user, req.body);
    if (user?.OTP != otp) {
      return responseError(res, 400, {}, "Invalid OTP");
    }
    await userModel.findByIdAndUpdate(user?._id, { OTP: "" }, { new: true });
    res.status(200).send({ success: true });
  } catch (error) {
    responseError(res, 500, error, "Server Error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return responseError(res, 404, "User not found", "User Not Found!");
    }

    let status = 200;
    let success= true;
    E_updatePassword(user?.firebase_UID, newPassword)
      .then((res) => {
        success
      })
      .catch((e) => {
       success= false;
       status = 400
      });

    res
      .status(status)
      .send({success: success });
  } catch (error) {
    responseError(res, 500, error);
  }
};

module.exports = {
  signUp,
  signIn,
  JWTtoken,
  getProfile,
  signout,
  updateProfileAddress,
  updateProfile,
  searchUserByPhone,
  viewMemberShipForUser,
  ReqForOTP,
  verifyOTP,
  resetPassword,
};
