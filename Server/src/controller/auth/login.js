const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const bcrypt=require("bcrypt")
const dotenv=require("dotenv").config()
const {generateTokens}=require("../../utils/generateTokens")


const login = async (req,res) => {
  try {

    const {email,password}=req.body

    const user=await User.findOne({email:email})

    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
   
    const isPassword= await bcrypt.compare(password,user.password)
    
    if(!isPassword){
         return res.status(400).json({message:"Invalid email or password"})
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
 
    res.status(200).json({message:"Logged in successfully",data:{
        firstName:user.firstName,
        id:user._id,
        role:user.role
    }})

  } catch (e) {
    console.log(e);
    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=login