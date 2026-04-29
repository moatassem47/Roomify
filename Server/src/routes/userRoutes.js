const { getUserData, changeUserData }=require("../controller/userController");
const {verfiyToken}=require("../middleware/authMiddleware")
const express=require("express");
const router=express.Router();

router.get("/",verfiyToken,getUserData);
router.patch("/edit",verfiyToken,getUserData);


module.exports = router;