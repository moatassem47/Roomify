const Order=require("../model/orderSchema")
const Cart=require("../model/cartSchema")
const Product=require("../model/productSchema")
const mongoose=require("mongoose")


const createOrder=async(req,res)=>{

    const session=await mongoose.startSession()
    session.startTransaction()

    try{
        const userId=req.user.id
        const {shippingAddress,paymentMethod}=req.body
        
        const cart= await Cart.findOne({userId}).session(session).populate("items.productId","price name")

         if (!cart || cart.items.length === 0) {
        await session.abortTransaction();
        return res.status(404).json({ message: "there's no items in your cart" });
        }


        const totalAmount=cart.items.reduce((total,item)=>{
            const itemPrice=item.quantity*item.productId.price
            return total+=itemPrice
        },0)

        const orderItems=cart.items.map((item)=>(
            {
                productId:item.productId._id,
                quantity:item.quantity,
                unitPrice:item.productId.price
            }
        ))

        const order= await Order.create([{
            userId,
            totalAmount,
            shippingAddress,
            items:orderItems,
            paymentMethod
        }],{session})
        
        for(const item of cart.items){
            const updateProduct=await Product.updateOne(
                {_id:item.productId._id,stockQuantity:{$gte:item.quantity}},
                {$inc:{stockQuantity:-item.quantity}},
                {session}
            )

            if(updateProduct.modifiedCount===0){
                await session.abortTransaction()
                return res.status(400).json({message:`sorry,there's no enough of ${item.productId.name} in our storage`})
            }
        }


        cart.items=[]
        await cart.save({session})

        await session.commitTransaction()

        res.status(201).json({message:"order created",order:order[0]})
    }catch(e){
         await session.abortTransaction()
         res.status(500).json({ name: e.name, message: e.message });
    }finally{
        session.endSession()
    }
}


const showOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, startDate, endDate } = req.query;

        let query = { userId };

        if (status) {
            query.status = status;
        }

        
        if (startDate || endDate) {
            query.createdAt = {}; 
            if (startDate) {
                query.createdAt.$gte = new Date(startDate); 
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate); 
            }
        }

       
        const orders = await Order.find(query).sort({ createdAt: -1 })
            .populate("items.productId","name imageUrls")
            .populate("deliveryPersonId", "firstName lastName phone");

    
        res.status(200).json(orders);

    } catch (e) {
        res.status(500).json({ name: e.name, message: e.message });
    }
}

const getOrderByID=async(req,res)=>{
    try{
        const {id}=req.params;
        const userId=req.user.id

        const order= await Order.findOne({_id:id,userId})
            .populate("items.productId","name imageUrls")
            .populate("deliveryPersonId", "firstName lastName phone");
        if(!order){
            return  res.status(404).json({message:"this order not found"})
        }

        res.status(200).json(order)

    }catch(e){
        res.status(500).json({ name: e.name, message: e.message });
    }
}

const cancelOrder=async(req,res)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        const {id}=req.params
        const userId=req.user.id

        const order= await Order.findOne({_id:id,userId}).session(session)
        if(!order){
            await session.abortTransaction()
            return  res.status(404).json({message:"This order is not found"})
        }

        if (!['Placed', 'Packed'].includes(order.status)){
           await session.abortTransaction()
            return  res.status(400).json({message:`You cannot cancel this order. It is already ${order.status}`})
        }

        order.status="Cancelled"

        for(const item of order.items){
            await Product.updateOne({_id:item.productId},
                {$inc:{stockQuantity:+item.quantity}},
                {session}
            )
        }

        await order.save({session})
        await session.commitTransaction()
        res.status(200).json({message:"Order cancelled successfully"})

    }catch(e){
        await session.abortTransaction()
        res.status(500).json({ name: e.name, message: e.message });
    }finally{
        session.endSession()
    }
}


module.exports={createOrder,showOrders,getOrderByID,cancelOrder}