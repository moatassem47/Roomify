const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(404).json({ message: "there's no items in your cart" });
    }

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    const cartItems = [];
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Product not found" });
      }
      cartItems.push({
        product,
        quantity: Number(item.quantity)
      });
    }

    const totalAmount = cartItems.reduce((total, item) => {
      const itemPrice = item.quantity * item.product.price;
      return (total += itemPrice);
    }, 0);

    const orderItems = cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));

    for (const item of cartItems) {
      const updateProduct = await Product.updateOne(
        { _id: item.product._id, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session },
      );
       
      if (updateProduct.modifiedCount === 0) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({
            message: `Sorry, there's not enough of ${item.product.name} in our storage`,
          });
      }
    }
    
    const [order] = await Order.create(
      [
        {
          userId,
          totalAmount,
          shippingAddress,
          items: orderItems,
          paymentMethod,
          statusHistory: [
            {
              status: "Placed",
              date: new Date(),
            },
          ],
        },
      ],
      { session },
    );

     
    await session.commitTransaction();
    res.status(201).json({ message: "order created", order: order });
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

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

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.productId", "name imageUrls")
      .populate("deliveryPersonId", "firstName lastName phone");

    res.status(200).json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId })
      .populate("items.productId", "name imageUrls")
      .populate("deliveryPersonId", "firstName lastName phone");
    if (!order) {
      return res.status(404).json({ message: "this order not found" });
    }

    res.status(200).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId }).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "This order is not found" });
    }

    if (!["Placed", "Packed"].includes(order.status)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({
          message: `You cannot cancel this order. It is already ${order.status}`,
        });
    }

    order.status = "Cancelled";
    order.statusHistory.push({
      status: "Cancelled",
      date: new Date(),
    });
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: +item.quantity } },
        { session },
      );
    }

    await order.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Order Cancelled Successfully" });
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

module.exports = { createOrder, showOrders, getOrderByID, cancelOrder };
