const express=require("express")
const {addProduct,deleteProduct,updateProduct}=require("../controller/admin/adminProductController")
const upload=require("../middleware/uploadMiddleware")
const router=express.Router()
const {verfiyToken,restrictedTo}=require("../middleware/authMiddleware")
const {addDeliveryUser,deleteDeliveryUser,showAllDeliverieUsers,showDeliveryUserByID}=require("../controller/admin/adminDelvieryController")
const {showAllOrders,updateOrderStatus}=require("../controller/admin/adminOrdersController")
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
router.get("/delivery/:id",verfiyToken,restrictedTo("admin"),showDeliveryUserByID)

//orders
router.get("/orders",verfiyToken,restrictedTo("admin"),showAllOrders)
router.patch("/orders/:id",verfiyToken,restrictedTo("admin"),updateOrderStatus)


//Dashboard
router.get("/dashboard",verfiyToken,restrictedTo("admin"),getDashboardStats)

module.exports = router;
