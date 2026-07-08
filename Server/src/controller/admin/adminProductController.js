const Product=require("../../model/productSchema")
const mongoose=require("mongoose")
const {uploudToCloudinary,DeleteProductFromCloudinary}=require("../../utils/cloudinaryHandler")
const upload=require("../../middleware/uploadMiddleware")

const hasValue=(value)=>value !== undefined && value !== null && value !== ""

const normalizeList=(value)=>{
    if(Array.isArray(value)){
        return value
    }

    if(typeof value === "string"){
        return value.split(",").map((item)=>item.trim()).filter(Boolean)
    }

    return []
}

const normalizeSpecs=(specs)=>{
    if(!specs){
        return undefined
    }

    let parsedSpecs=specs

    if(typeof specs === "string"){
        try{
            parsedSpecs=JSON.parse(specs)
        }catch(e){
            return undefined
        }
    }

    if(!parsedSpecs || typeof parsedSpecs !== "object"){
        return undefined
    }

    const nextSpecs={...parsedSpecs}

    if("material" in nextSpecs){
        nextSpecs.material=normalizeList(nextSpecs.material)
    }

    if("color" in nextSpecs){
        nextSpecs.color=normalizeList(nextSpecs.color)
    }

    return nextSpecs
}


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
                specs:normalizeSpecs(specs),
                imageUrls:imagesUrl,
                model3dUrl:modelurl
            }
        )

        res.status(201).json({message:"New product added succefully",data:newProduct})

    }catch(e){
        console.log(e.message)
        res.status(500).json({message:e.message})
    }
}


exports.deleteProduct=async(req,res)=>{
    try{
        const id=req.params.id

        const product=await Product.findById(id)

        if(!product){
            return res.status(404).json({message:"this no product with this id"})
        }
           console.log({
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
            });
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
        const{description,price,stockQuantity,category,rating,specs}=req.body
    
        const product=await Product.findById(id)

        if(!product){
            return res.status(404).json({message:"this no product with this id"})
        }
        if(hasValue(description)){
            product.description=description
        }
        if(hasValue(price)){
            product.price=price
        }
        if(hasValue(stockQuantity)){
            product.stockQuantity=stockQuantity
        }
        if(hasValue(category)){
            product.category=category
        }
        if(hasValue(rating)){
            product.rating=rating
        }

        const nextSpecs=normalizeSpecs(specs)
        if(nextSpecs){
            product.specs = { ...(product.specs?.toObject?.() || product.specs || {}), ...nextSpecs };
        }
        
        await product.save()
    
        res.status(200).json({
            message:"Product updated succefully",
            data:product
        })

    }catch(e){
        res.status(500).json({message:e.message})
    }

}
