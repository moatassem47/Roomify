const express=require("express")
const {addProduct,deleteProduct,updateProduct}=require("../controller/admin/adminProductController")
const upload=require("../middleware/uploadMiddleware")
const router=express.Router()
const {verfiyToken,restrictedTo}=require("../middleware/authMiddleware")
const {addDeliveryUser,deleteDeliveryUser,showAllDeliverieUsers,showDeliveryUserByID, updateDeliveryUser, toggleDeliveryUserStatus, getDeliveryUserHistory}=require("../controller/admin/adminDelvieryController")
const {showAllOrders,updateOrderStatus,assignOrder}=require("../controller/admin/adminOrdersController")
const {getDashboardStats}=require("../controller/admin/analysisController")
const uploadFields=upload.fields([
    {name:"images",maxCount:6},
    {name:"model",maxCount:1}
])

//product
router.post("/product/add",verfiyToken,restrictedTo("admin"),uploadFields,addProduct)
router.delete("/product/delete/:id",verfiyToken,restrictedTo("admin"),deleteProduct)
router.patch("/product/update/:id",verfiyToken,restrictedTo("admin"),updateProduct)

//deliveryuser
router.post("/delivery/add",verfiyToken,restrictedTo("admin"),addDeliveryUser)
router.delete("/delivery/delete/:id",verfiyToken,restrictedTo("admin"),deleteDeliveryUser)
router.get("/delivery",verfiyToken,restrictedTo("admin"),showAllDeliverieUsers)
router.get("/delivery/:id/history",verfiyToken,restrictedTo("admin"),getDeliveryUserHistory)
router.get("/delivery/:id",verfiyToken,restrictedTo("admin"),showDeliveryUserByID)
router.patch("/delivery/update/:id",verfiyToken,restrictedTo("admin"),updateDeliveryUser)
router.patch("/delivery/status/:id",verfiyToken,restrictedTo("admin"),toggleDeliveryUserStatus)

//orders
router.get("/orders",verfiyToken,restrictedTo("admin"),showAllOrders)
router.patch("/orders/:id",verfiyToken,restrictedTo("admin"),updateOrderStatus)
router.patch("/orders/assign/:id",verfiyToken,restrictedTo("admin"),assignOrder)


//Dashboard
router.get("/dashboard",verfiyToken,restrictedTo("admin"),getDashboardStats)

module.exports = router;
