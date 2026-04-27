const Product=require("../../model/productSchema")
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
                name,
                description,
                price,
                stockQuantity,
                category,
                rating,
                specs,
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


exports.updateProduct=async(req,res)=>{
    try{
        const id=req.params.id
        const{name,description,price,stockQuantity,specs}=req.body
    
        const product=await Product.findById(id)

        if(!product){
            return res.status(404).json({message:"this no product with this id"})
        }

        if(name){
            product.name=name
        }
        if(description){
            product.description=description
        }
        if(price){
            product.price=price
        }
        if(stockQuantity){
            product.stockQuantity=stockQuantity
        }
        if(specs){
            product.specs = { ...product.specs.toObject(), ...specs };
        }
        
        await product.save()
    
        res.status(200).json({
            message:"Product updated succefully",
            data:product
        })

    }catch(e){
        res.status(500).json(e.message)
    }

}