const express=require("express")
const router=express.Router()
const {addToCart,getCart,deleteItem,clearCart,updateQuantity}=require("../controller/cartController")
const {verfiyToken,isVerified}=require("../middleware/authMiddleware")


router.post("/add",verfiyToken,isVerified,addToCart)

router.get("/",verfiyToken,isVerified,getCart)

router.delete("/delete/clear",verfiyToken,isVerified,clearCart)

router.delete("/delete/:productId",verfiyToken,isVerified,deleteItem)

router.patch("/update",verfiyToken,isVerified,updateQuantity)



module.exports=router
