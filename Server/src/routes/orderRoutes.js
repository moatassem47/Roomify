const express=require("express")
const router=express.Router()
const {createOrder,showOrders,getOrderByID,cancelOrder}=require("../controller/orderController")
const {verfiyToken,isVerified}=require("../middleware/authMiddleware")
const { createPaymentSession } = require("../controller/paymentController");

router.post("/add",verfiyToken,isVerified,createOrder)
router.get("/",verfiyToken,showOrders)
router.get("/:id",verfiyToken,isVerified,getOrderByID)
router.patch("/cancel/:id",verfiyToken,isVerified,cancelOrder)
router.post("/create-checkout-session", verfiyToken, isVerified, createPaymentSession);

module.exports=router
