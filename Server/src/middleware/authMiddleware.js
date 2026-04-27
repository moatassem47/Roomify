const jwt = require("jsonwebtoken")
const dotenv=require("dotenv").config()


const verfiyToken=(req,res,next)=>{
    try{
        const token=req.cookies.accessToken
        if(!token){
            return res.status(401).json({message:"there's no token plz login first"})
        }
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        
        req.user=decode
        next()

    }catch(e){
         console.log(e);
         res.status(403).json({
            name:e.name,
            message:e.message
         })
    }
}


const restrictedTo=(role)=>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).json({message:"you have no access"})
        }
        next()
    }
}

module.exports={verfiyToken,restrictedTo}



