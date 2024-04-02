const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");

const signUp = async (req,res)=>{
    try {
        const{name,email,firebase_UID,password,phone } = req.body;
        
        try {
            const checkUser = await  userModel.findOne({ email:email });
            if(!checkUser)
            {const createUser = await new userModel({
                name,email,firebase_UID,password,phone 
            }).save();
            res.status(200).send(true);
        }else{
            const updateUser = await  userModel.findByIdUpdate(checkUser._id ,{ firebase_UID })
        }
        } catch (error) {
            responseError(res,500,"internal server error",error);
            
        }

    } catch (error) {
        responseError(res,500,"did not get value",error);
    }
}
const signIn =async(req,res)=>{
    const{email}=req.body;
    const  user=await userModel.findOne({email });
    
    if(!user){responseError(res,401,"Invalid Email or Password")}
    else{
        res.status(200).send(user);
    }
}


module.exports ={
    signUp,
    signIn
}

