

const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const bcrypt=require("bcrypt")
const dotenv=require("dotenv").config()
const {generateTokens}=require("../../utils/generateTokens")
const cookieOptions=require("../../utils/cookieOptions")
const { buildFrontendUrl } = require("../../config/urls")


const googleLogin = async (req,res) => {
  try {

    const user = req.user;
    
    const {accessToken,refreshToken}=generateTokens(user)


    const CookieOptions={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
    }


    res.cookie("accessToken",accessToken,{
        ...cookieOptions,
        expires:new Date(Date.now() + 3 * 60 * 1000)
    })

     res.cookie("refreshToken",refreshToken,{
        ...cookieOptions,
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
 
    res.redirect(buildFrontendUrl("/"))

  } catch (e) {
    console.log(e);
    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=googleLogin
