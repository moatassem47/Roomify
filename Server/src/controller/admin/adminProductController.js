const Product=require("../../model/productModel")
const mongoose=require("mongoose")
const {uploudToCloudinary,DeleteProductFromCloudinary}=require("../../utils/cloudinaryHandler")
const upload=require("../../middleware/uploadMiddleware")


exports.addProduct=async(req,res)=>{
    try{
        const {name,description,price,stockQuantity,category,rating,specs}=req.body

        const imagesUrl=[]

        if(req.files && req.files.images){
            for(let image of req.files.images){
                const url= await uploudToCloudinary(image.path,name,false)
                if(url){
                    imagesUrl.push(url)
                }
            }
        }


        let modelurl=""

        if(req.files&&req.files.model){
            const url = await uploudToCloudinary(req.files.model[0].path,name,true)
            if(url){
                modelurl=url
            }
        }

        
        const newProduct= await Product.create(
            {
                name:name,
                description:description,
                price:price,
                stockQuantity:stockQuantity,
                category:category,
                rating:rating,
                specs:specs,
                imageUrls:imagesUrl,
                model3dUrl:modelurl
            }
        )

        res.status(201).json({message:"New product added succefully",data:newProduct})

    }catch(e){
        console.log(e.message)
        res.status(500).json(e)
    }
}


exports.deleteProduct=async(req,res)=>{
    try{
        const id=req.params.id

        const product=await Product.findById(id)

        if(!product){
            return res.status(404).json({message:"this no product with this id"})
        }

        const isDeleted=await DeleteProductFromCloudinary(product.name)
        
        if(!isDeleted){
            return res.status(500).json({message:"Can't remove this product from cloudinary"})
        }

        const DeletedProduct=await Product.deleteOne({_id:id})
    
        res.status(200).json({
            message:"Product deleted succefully",
            data:DeletedProduct
        })

    }catch(e){
        res.status(500).json(e.message)
    }

}