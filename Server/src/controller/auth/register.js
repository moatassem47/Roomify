const mongoose=require("mongoose")
const User=require("../../model/userSchema")



const register= async(req,res)=>{
try{
    const {firstName,lastName,email,password,phone,address}=req.body
    
    const isExist= await User.findOne({email:email})

    if(isExist){
        return res.status(400).json({message:"User already exists"})
    }

   

    const newUser= await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role:"customer"
    })
    
    const userResponse = newUser.toObject();
    delete userResponse.password

   res.status(201).json({message:"Your account created succefully", data:userResponse})

}catch(e){
  console.error(e);

  res.status(500).json({
    name: e.name,
    message: e.message,
  });

}

}

module.exports=register