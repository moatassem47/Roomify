const Order = require("../model/orderSchema");

const deliveryPopulate = [
  {
    path: "userId",
    select: "firstName lastName name email phone",
  },
  {
    path: "items.productId",
    select: "name imageUrls",
  },
];

const getAvailableOrders = async (req, res) => { 
  try {
    const orders = await Order.find({
      status: "Packed", 
      deliveryPersonId: { $exists: false }, 
    })
      .sort({ createdAt: 1 })
      .populate(deliveryPopulate);

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

    if (order.status !== "Packed") {
        return res.status(400).json({ message: "This order is not ready to go out for delivery" });
    }

    if (order.deliveryPersonId && order.deliveryPersonId.toString() !== deliveryId) {
        return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    if (!order.deliveryPersonId) {
      order.deliveryPersonId = deliveryId;
    }

    order.status = "Out for Delivery";
    order.statusHistory.push({
      status: "Out for Delivery",
      date: new Date(),
    });
    await order.save();

    const updatedOrder = await Order.findById(id).populate(deliveryPopulate);

    res.status(200).json({ message: "Delivery status updated successfully", order: updatedOrder });
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

    if (!order.deliveryPersonId) {
        return res.status(403).json({ message: "This order is not assigned to a delivery user" });
    }

    if (order.deliveryPersonId.toString() !== deliveryId) {
        return res.status(403).json({ message: "You are not authorized to deliver this order" });
    }

  
    if (order.status !== "Out for Delivery") {
        return res.status(400).json({ message: "Order is not out for delivery" });
    }
 
    order.status = "Delivered";
    order.deliveredAt = Date.now(); 
    order.statusHistory.push({
      status: "Delivered",
      date: new Date(),
    });
    await order.save();

    const updatedOrder = await Order.findById(id).populate(deliveryPopulate);

    res.status(200).json({ message: "Great job! You delivered this order", order: updatedOrder });
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
      .populate(deliveryPopulate);

    
    if (orders.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

const getMyDeliveryById = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      deliveryPersonId: deliveryId,
    }).populate(deliveryPopulate);

    if (!order) {
      return res.status(404).json({ message: "This order is not assigned to you" });
    }

    res.status(200).json(order);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};



module.exports = { getAvailableOrders, claimOrder, orderDelivered,getMyDeliveries, getMyDeliveryById };
