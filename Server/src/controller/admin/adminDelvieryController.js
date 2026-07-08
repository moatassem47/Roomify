const mongoose=require("mongoose")
const User=require("../../model/userSchema")
const Order=require("../../model/orderSchema")

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0

const normalizeString = (value) =>
    typeof value === "string" ? value.trim() : value

const validateDeliveryPayload = (body, { isEdit = false } = {}) => {
    const requiredFields = [
        "firstName",
        "lastName",
        "phone",
        "vehicleType",
        "licensePlate",
    ]

    if (!isEdit) {
        requiredFields.push("email", "password")
    }

    for (const field of requiredFields) {
        if (!isNonEmptyString(body[field])) {
            return `${field} is required`
        }
    }

    const address = body.address || {}
    if (!isNonEmptyString(address.city) || !isNonEmptyString(address.streetAddress)) {
        return "city and streetAddress are required"
    }

    if (!isEdit && !/^\S+@\S+\.\S+$/.test(body.email.trim())) {
        return "Invalid email address"
    }

    if (!/^(01\d{9}|\+20\s?0?1\d{9})$/.test(body.phone.trim())) {
        return "Phone number must be in the format 01234567890 or +20 01234567890"
    }

    if (!isEdit && body.password.length < 8) {
        return "Password must be at least 8 characters"
    }

    return null
}

const addDeliveryUser=async(req,res)=>{
    try{
        
        const {firstName,lastName,email,password,phone,address,vehicleType,licensePlate}=req.body

        const validationError = validateDeliveryPayload(req.body)
        if (validationError) {
            return res.status(400).json({message: validationError})
        }

        const normalizedEmail = email.trim().toLowerCase()
        const isExist= await User.findOne({email:normalizedEmail})
        
            if(isExist){
                return res.status(400).json({message:"User already exists"})
            }
            

        const deliveryPerson=await User.create({
            firstName: normalizeString(firstName),
            lastName: normalizeString(lastName),
            email: normalizedEmail,
            password,
            phone: normalizeString(phone),
            address: {
                city: normalizeString(address.city),
                streetAddress: normalizeString(address.streetAddress),
            },
            deliveryDetails: {
                vehicleType: normalizeString(vehicleType),
                licensePlate: normalizeString(licensePlate),
            },
            isActive: true,
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid delivery user id"})
        }

        const activeOrder = await Order.findOne({
            deliveryPersonId: id,
            status: { $in: ["Packed", "Out for Delivery"] },
        })

        if (activeOrder) {
            return res.status(400).json({message:"This delivery user has active assigned orders"})
        }

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
  
    const deliveryUsers= await User.find({role:"delivery"}).select("-password -refreshToken")

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message:"Invalid delivery user id"})
    }

    const deliveryUser= await User.findOne({_id:id,role:"delivery"}).select("-password -refreshToken")

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid delivery user id"})
        }

        const validationError = validateDeliveryPayload(req.body, { isEdit: true })
        if (validationError) {
            return res.status(400).json({message: validationError})
        }

        const updateData = {
            firstName: normalizeString(firstName),
            lastName: normalizeString(lastName),
            phone: normalizeString(phone),
            address: {
                city: normalizeString(address.city),
                streetAddress: normalizeString(address.streetAddress),
            },
            deliveryDetails: {
                vehicleType: normalizeString(vehicleType),
                licensePlate: normalizeString(licensePlate),
            }
        }

        const updatedUser= await User.findOneAndUpdate(
            {_id:id ,role:"delivery"},
            updateData,
            {new: true, runValidators: true}
        ).select("-password -refreshToken")
        
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid delivery user id"})
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({message:"isActive must be true or false"})
        }

        if (isActive === false) {
            const activeOrder = await Order.findOne({
                deliveryPersonId: id,
                status: { $in: ["Packed", "Out for Delivery"] },
            })

            if (activeOrder) {
                return res.status(400).json({message:"Cannot deactivate a delivery user with active assigned orders"})
            }
        }

        const deliveryStatus = isActive ? "available" : "offline"
        const updatedUser= await User.findOneAndUpdate(
            {_id:id ,role:"delivery"},
            {isActive, "deliveryDetails.deliveryStatus": deliveryStatus},
            {new: true, runValidators: true}
        ).select("-password -refreshToken")
        
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid delivery user id"})
        }
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
