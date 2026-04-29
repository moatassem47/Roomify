const express=require("express")
const router=express.Router()
const {addToCart,getCart,deleteItem,clearCart,updateQuantity}=require("../controller/cartController")
const {verfiyToken}=require("../middleware/authMiddleware")


router.post("/add",verfiyToken,addToCart)

router.get("/",verfiyToken,getCart)

router.delete("/delete/:productID",verfiyToken,deleteItem)

router.delete("/delete/clear",verfiyToken,clearCart)

router.patch("/update",verfiyToken,updateQuantity)



module.exports=router