

const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const bcrypt=require("bcrypt")
const dotenv=require("dotenv").config()
const {generateTokens}=require("../../utils/generateTokens")


const googleLogin = async (req,res) => {
  try {

    const user = req.user;
    
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
 
    res.redirect("http://localhost:5173/")

  } catch (e) {
    console.log(e);
    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=googleLogin