const mongoose=require("mongoose")
const User=require("../../model/userSchema")
const Order=require("../../model/orderSchema")
const { updateMany } = require("../../model/productSchema")
const addDeliveryUser=async(req,res)=>{
    try{
        
        const {firstName,lastName,email,password,phone,address,vehicleType,licensePlate}=req.body

        const isExist= await User.findOne({email:email})
        
            if(isExist){
                return res.status(400).json({message:"User already exists"})
            }
            

        const deliveryPerson=await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            deliveryDetails: { vehicleType, licensePlate },
            role:"delivery"
        })


        const deliveryResponse = deliveryPerson.toObject();
        delete deliveryResponse.password

        res.status(201).json({message:"account created succefully", data:deliveryResponse})


    }catch(e){
    console.error(e);

  res.status(500).json({
    name: e.name,
    message: e.message,
  });
    }
}



const deleteDeliveryUser=async(req,res)=>{

     try{
        
        const {id}=req.params

        const isExist= await User.findOneAndDelete({_id:id ,role:"delivery"})
        
            if(!isExist){
                return res.status(404).json({message:"there is no delivery user with this id"})
            }
            
        res.status(200).json({message:"delivery user deleted succefully", data:isExist})

    }catch(e){
    console.error(e);

  res.status(500).json({
    name: e.name,
    message: e.message,
  });
    } 
}

const showAllDeliverieUsers=async(req,res)=>{
 try{
  
    const deliveryUsers= await User.find({role:"delivery"})
    if(deliveryUsers.length===0){
          return res.status(404).json({message:"there is no delivery user assign yet"})
    }

     res.status(200).json({data:deliveryUsers
     })

 }catch(e){
    console.error(e);

  res.status(500).json({
    name: e.name,
    message: e.message,
  });
    } 
}


const showDeliveryUserByID=async(req,res)=>{
 try{
    const{id}=req.params

    const deliveryUser= await User.findOne({_id:id,role:"delivery"})

    if(!deliveryUser){
          return res.status(404).json({message:"there is no delivery user with this id"})
    }

     res.status(200).json({data:deliveryUser})

 }catch(e){
    console.error(e);

  res.status(500).json({
    name: e.name,
    message: e.message,
  });
    } 
}
const updateDeliveryUser=async(req,res)=>{
     try{
        const {id}=req.params
        const {firstName,lastName,phone,address,vehicleType,licensePlate}=req.body

        const updateData = {
            firstName,
            lastName,
            phone,
            address,
            deliveryDetails: { vehicleType, licensePlate }
        }

        const updatedUser= await User.findOneAndUpdate({_id:id ,role:"delivery"}, updateData, {new: true})
        
        if(!updatedUser){
            return res.status(404).json({message:"there is no delivery user with this id"})
        }
            
        res.status(200).json({message:"delivery user updated succefully", data:updatedUser})

    }catch(e){
        console.error(e);
        res.status(500).json({
            name: e.name,
            message: e.message,
        });
    } 
}

const toggleDeliveryUserStatus=async(req,res)=>{
     try{
        const {id}=req.params
        const {isActive}=req.body

        const updatedUser= await User.findOneAndUpdate({_id:id ,role:"delivery"}, {isActive}, {new: true})
        
        if(!updatedUser){
            return res.status(404).json({message:"there is no delivery user with this id"})
        }
            
        res.status(200).json({message:"delivery user status updated succefully", data:updatedUser})

    }catch(e){
        console.error(e);
        res.status(500).json({
            name: e.name,
            message: e.message,
        });
    } 
}

const getDeliveryUserHistory=async(req,res)=>{
    try{
        const {id}=req.params
        const orders = await Order.find({ deliveryPersonId: id }).sort({ createdAt: -1 }).populate('items.productId');

        res.status(200).json({ data: orders })
    }catch(e){
        console.error(e);
        res.status(500).json({
            name: e.name,
            message: e.message,
        });
    } 
}

module.exports={
    addDeliveryUser,
    deleteDeliveryUser,
    showAllDeliverieUsers,
    showDeliveryUserByID,
    updateDeliveryUser,
    toggleDeliveryUserStatus,
    getDeliveryUserHistory
}