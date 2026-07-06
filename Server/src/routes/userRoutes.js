const { getUserData, changeUserData,deleteAccount ,toggleWishlist,getWishlist}=require("../controller/userController");
const {verfiyToken,isVerified}=require("../middleware/authMiddleware")
const express=require("express");
const router=express.Router();

router.get("/",verfiyToken,getUserData);
router.patch("/edit",verfiyToken,isVerified,changeUserData);
router.delete("/delete",verfiyToken,isVerified,deleteAccount)
router.post("/wishlist/:ProductID",verfiyToken,isVerified,toggleWishlist)
router.get("/wishlist",verfiyToken,isVerified,getWishlist)


module.exports = router;
