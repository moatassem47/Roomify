const { getAvailableOrders,claimOrder,orderDelivered,getMyDeliveries,getMyDeliveryById}=require("../controller/deliveryController");
const {verfiyToken,restrictedTo}=require("../middleware/authMiddleware")
const express=require("express");
const router=express.Router();



router.get("/available",verfiyToken,restrictedTo("delivery"),getAvailableOrders)
router.patch("/claim/:id",verfiyToken,restrictedTo("delivery"),claimOrder)
router.patch("/deliverd/:id",verfiyToken,restrictedTo("delivery"),orderDelivered)
router.get("/",verfiyToken,restrictedTo("delivery"),getMyDeliveries)
router.get("/:id",verfiyToken,restrictedTo("delivery"),getMyDeliveryById)

module.exports=router
