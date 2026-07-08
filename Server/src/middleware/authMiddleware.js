const jwt = require("jsonwebtoken")
const dotenv=require("dotenv").config()
const User = require("../model/userSchema")


const verfiyToken=async (req,res,next)=>{
    try{
        const token=req.cookies.accessToken
        if(!token){
            return res.status(401).json({message:"There's no token please Login First"})
        }
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        const currentUser= await User.findOne({_id:decode.id,isDeleted: { $ne: true } })
        if(!currentUser){
          return res.status(401).json({ 
                message: "The user belonging to this token no longer exists or has been deleted." 
            });
        }

        if (currentUser.role === "delivery" && currentUser.isActive === false) {
          return res.status(403).json({ message: "This delivery account is inactive." });
        }

        req.user={
          id: currentUser._id,
          role: currentUser.role,
          isVerified:
            currentUser.role === "admin" ||
            currentUser.role === "delivery" ||
            Boolean(currentUser.isVerified),
        }
        next()

    }catch(e){
         console.log(e);
         res.status(401).json({
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

const isVerified = async (req, res, next) => {
  try {
    if (req.user.role === "admin" || req.user.role === "delivery") {
      return next();
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first."
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      name: e.name,
      message: e.message
    });
  }
};



module.exports={verfiyToken,restrictedTo,isVerified}



