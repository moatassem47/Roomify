const express=require("express")
const router=express.Router()
const {addToCart,getCart,deleteItem,clearCart,updateQuantity}=require("../controller/cartController")
const {verfiyToken}=require("../middleware/authMiddleware")


router.post("/add",verfiyToken,addToCart)

router.get("/",verfiyToken,getCart)

router.delete("/delete/clear",verfiyToken,clearCart)

router.delete("/delete/:productId",verfiyToken,deleteItem)

router.patch("/update",verfiyToken,updateQuantity)



module.exports=router