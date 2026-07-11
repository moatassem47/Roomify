const { getUserData, changeUserData,deleteAccount }=require("../controller/userController");
const {verfiyToken,isVerified}=require("../middleware/authMiddleware")
const express=require("express");
const router=express.Router();

router.get("/",verfiyToken,getUserData);
router.patch("/edit",verfiyToken,isVerified,changeUserData);
router.delete("/delete",verfiyToken,deleteAccount)


module.exports = router;
