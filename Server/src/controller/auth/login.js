const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const bcrypt=require("bcrypt")
const dotenv=require("dotenv").config()
const {generateTokens}=require("../../utils/generateTokens")

const sanitizeUser = (user) => {
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.verificationToken;
  delete userResponse.verificationExpires;

  userResponse.isVerified =
    userResponse.role === "admin" ||
    userResponse.role === "delivery" ||
    Boolean(userResponse.isVerified);

  return userResponse;
};

const login = async (req,res) => {
  try {

    const {email,password}=req.body

    const user=await User.findOne({email:email}).select("+password")

    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
   
    if(!user.providers?.includes("local")&&user.role==="customer"){
    return res.status(400).json({
  "message": "This account uses Google sign-in. Please continue with Google or set a password first in register."
})
    }
    const isPassword= await bcrypt.compare(password,user.password)
    
    if(!isPassword){
         return res.status(403).json({message:"Invalid email or password"})
    }
    
    const {accessToken,refreshToken}=generateTokens(user)



    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });


    const CookieOptions={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
    }


    res.cookie("accessToken",accessToken,{
        ...CookieOptions,
        expires:new Date(Date.now() + 3 * 60 * 1000)
    })

     res.cookie("refreshToken",refreshToken,{
        ...CookieOptions,
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
 
   res.status(200).json({
    message: "Logged in successfully",
    data: sanitizeUser(user),
   });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=login
