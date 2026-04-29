const mongoose = require("mongoose");
const mongoosePaginate=require("mongoose-paginate-v2")

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
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
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
        city: { type: String, required: true },
        street: { type: String, required: true },
        buildingNumber: { type: String },
        phone: { type: String, required: true }
    },
    items: [orderItemSchema],
    
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card'],
        default: 'Cash'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    stripeSessionId: {
        type: String
    },
    deliveredAt: {
        type: Date 
    }
}, { timestamps: true });

orderSchema.index({ status: 1, userId: 1 });
orderSchema.plugin(mongoosePaginate)

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;