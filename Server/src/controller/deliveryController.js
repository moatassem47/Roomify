const Order = require("../model/orderSchema");


const getAvailableOrders = async (req, res) => { 
  try {
    const orders = await Order.find({
      status: "Packed", 
      deliveryPersonId: { $exists: false }, 
    })
      .sort({ createdAt: 1 })
      .populate([
        {
          path: "userId",
          select: "name phone",
        },
        {
          path: "items.productId",
          select: "name",
        },
      ]);

    if (orders.length === 0) {
      return res.status(404).json({ message: "There are no orders to deliver right now" });
    }

    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};


const claimOrder = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const { id } = req.params; 

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Can't find this order" });
    }

 
    if (order.status !== "Packed" || order.deliveryPersonId) {
        return res.status(400).json({ message: "Sorry, this order is already claimed or not ready" });
    }

    order.deliveryPersonId = deliveryId;
    order.status = "Out for Delivery";
    await order.save();

    res.status(200).json({ message: "You claimed this order successfully", order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};


const orderDelivered = async (req, res) => { 
  try {
    const deliveryId = req.user.id; 
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Can't find this order" });
    }

   
    if (order.deliveryPersonId.toString() !== deliveryId) {
        return res.status(403).json({ message: "You are not authorized to deliver this order" });
    }

  
    if (order.status !== "Out for Delivery") {
        return res.status(400).json({ message: "Order is not out for delivery" });
    }
 
    order.status = "Delivered";
    order.deliveredAt = Date.now(); 
    await order.save();

    res.status(200).json({ message: "Great job! You delivered this order", order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};


const getMyDeliveries = async (req, res) => {
  try {
    const deliveryId = req.user.id; 
    const { status } = req.query; 

   
    const query = { deliveryPersonId: deliveryId };
    
    
    if (status) {
        query.status = status;
    }

    
    const orders = await Order.find(query)
      .sort({ updatedAt: -1 }) 
      .populate([
        {
          path: "userId",
          select: "name phone", 
        },
        {
          path: "items.productId",
          select: "name imageUrls", 
        },
      ]);

    
    if (orders.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}



module.exports = { getAvailableOrders, claimOrder, orderDelivered,getMyDeliveries };