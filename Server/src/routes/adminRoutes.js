const express=require("express")
const {addProduct,deleteProduct}=require("../controller/admin/adminProductController")
const upload=require("../middleware/uploadMiddleware")
const router=express.Router()


const uploadFields=upload.fields([
    {name:"images",maxCount:6},
    {name:"model",maxCount:1}
])


router.post("/product/add",uploadFields,addProduct)
router.delete("/product/:id",deleteProduct)


module.exports = router;
