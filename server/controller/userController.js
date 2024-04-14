const { Mutex } = require("async-mutex");
const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");
const JWT = require("jsonwebtoken");
const membershipModel = require("../model/membershipModel");
const mutex = new Mutex();
const signUp = async (req, res) => {
  try {
    const { name, email, firebase_UID, password, phone } = req.body;
    console.log(req.body);

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
    console.log(req.body);

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
    console.log(error);
    responseError(res, 500, "Internal server error");
  }
};

const checktoken = (req, res, next) => {
  const id = req.cookies._ut;
  const userId = req.params.userId;
  // console.log(req.body);
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
      console.log(e);
    };
  }
};
const getProfile = async (req, res) => {
  try {
    // const release = await mutex.acquire();
    const email = req.params.email;
    const user = await userModel.findOne({ email: email }, "-password");
    console.log("hello", user, email)
    if (!user) {
      console.log(user, email);
      responseError(res, 401, null, "User not found");
      return
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
    console.log(req.body);
    const user = await userModel.findOne({ email: email });
    // console.log(user);

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
    //console.log(req.body);
    const { email } = req.params;
    const { streetAddress, city, stateProvince, postalCode, country } =
      req.body;
    //console.log(decoded);
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

const searchUserByPhone = async(req,res)=>{
  try {
    const {phone} = req.query;
    if(!phone){
      return res.status(200).send([{ _id: "null", name: 'Anonymous', phone: '000-000-000' }]);
    }
    const regexPattern = new RegExp(phone,'i');
    const users = await userModel.find({phone:{$regex : regexPattern}}).select("_id name phone").limit(8).exec() ;
    if(users.length==0){
     return res.status(200).send([{ _id: "null", name: 'Anonymous', phone: '000-000-000' }]);
    }
    res.status(200).send(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const viewMemberShipForUser = async(req,res) =>{
  try {
    const {email} = req.params;
    const user = await  userModel.findOne({ email });
    if( !user ) throw new Error('User not found!')
    else{
      const memberShip = await  membershipModel.find({memberShip : user?._id}).populate("res_id");
      if(memberShip.length == 0) {
        return res.status(200).send({});
      }
      const formattedData =  memberShip.map((item) => ({
        res_name : item?.res_id?.res_name || '' ,
        res_img: item?.res_id?.img || ''
      }))
      res.status(200).send(formattedData) ;
    }

  } catch (error) {
    responseError(res,500,error,"Internal server error");
    
  }
}

module.exports = {
  signUp,
  signIn,
  JWTtoken,
  getProfile,
  signout,
  updateProfileAddress,
  updateProfile,
  searchUserByPhone,
  viewMemberShipForUser
};
