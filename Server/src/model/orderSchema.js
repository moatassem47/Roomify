const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true 
    }
},{ _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: false
    },
    status: {
        type: String,
        enum: ['Placed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card'],
        default: 'Cash'
    },
    deliveredAt: {
        type: Date 
    }
}, { timestamps: true });



 const Order = mongoose.model("Order", orderSchema);

 module.exports=Order