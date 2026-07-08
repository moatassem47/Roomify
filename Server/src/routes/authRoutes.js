const express=require("express")
const {register,login,refreshToken,logout,googleLogin,verifyEmail,resendVerificationEmail,changeVerificationEmail,resetPassword,enterNewPassword}=require("../controller/auth/index")
const router=express.Router()
const passport=require("passport")
const {verfiyToken}=require("../middleware/authMiddleware")

router.post("/register",register)
router.post("/login",login)
router.get("/refresh",refreshToken)
router.post("/logout",logout)
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google",{
session: false,
failureMessage:"Failed to login with Google"}),googleLogin)
router.get("/verify-email/:token",verifyEmail)
router.post("/resendVerificationEmail",resendVerificationEmail)
router.patch("/verification-email",verfiyToken,changeVerificationEmail)
router.post("/reset-password",resetPassword)
router.patch("/changePassword/:token",enterNewPassword)
module.exports=router

