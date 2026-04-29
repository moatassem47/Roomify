const mongoose=require("mongoose")
const Order=require("../../model/orderSchema")


const showAllOrders = async (req, res) => {
    try {
        
        const { status, startDate, endDate, page, limit } = req.query;

     

        const query = {};


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

       const options = {
            page: parseInt(page, 10) || 1, 
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 }, 
            populate: [ 
                {
                    path: "items.productId",
                    select: "name imageUrls"
                },
                {
                    path: "userId",
                    select: "name email phone" 
                }
            ]
        };

        const orders = await Order.paginate(query,options)

        
        res.status(200).json(
            orders);

    } catch (e) {
        res.status(500).json({ name: e.name, message: e.message });
    }
}




const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Placed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({ 
            message: `Order status updated to ${status}`, 
            order 
        });

    } catch (e) {
        res.status(500).json({ name: e.name, message: e.message });
    }
}

module.exports={showAllOrders,updateOrderStatus}