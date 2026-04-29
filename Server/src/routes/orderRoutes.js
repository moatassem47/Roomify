const express=require("express")
const router=express.Router()
const {createOrder,showOrders,getOrderByID,cancelOrder}=require("../controller/orderController")
const {verfiyToken}=require("../middleware/authMiddleware")
const { createPaymentSession } = require("../controller/paymentController");

router.post("/add",verfiyToken,createOrder)
router.get("/",verfiyToken,showOrders)
router.get("/:id",verfiyToken,getOrderByID)
router.patch("/cancel/:id",verfiyToken,cancelOrder)
router.post("/create-checkout-session", verfiyToken, createPaymentSession);

module.exports=router
