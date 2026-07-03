const { getUserData, changeUserData,deleteAccount ,toggleWishlist,getWishlist}=require("../controller/userController");
const {verfiyToken}=require("../middleware/authMiddleware")
const express=require("express");
const router=express.Router();

router.get("/",verfiyToken,getUserData);
router.patch("/edit",verfiyToken,changeUserData);
router.delete("/delete",verfiyToken,deleteAccount)
router.post("/wishlist/:ProductID",verfiyToken,toggleWishlist)
router.get("/wishlist",verfiyToken,getWishlist)


module.exports = router;