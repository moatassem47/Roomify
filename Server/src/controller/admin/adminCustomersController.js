const Order = require("../../model/orderSchema");
const User = require("../../model/userSchema");

const showAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password -refreshToken -verificationToken -passwordResetToken")
      .sort({ createdAt: -1 })
      .lean();

    const customerIds = customers.map((customer) => customer._id);
    const orders = await Order.find({ userId: { $in: customerIds } })
      .populate("items.productId", "name imageUrls")
      .sort({ createdAt: -1 })
      .lean();

    const ordersByCustomer = orders.reduce((result, order) => {
      const key = order.userId.toString();
      result[key] = result[key] || [];
      result[key].push(order);
      return result;
    }, {});

    const customersWithOrders = customers.map((customer) => {
      const customerOrders = ordersByCustomer[customer._id.toString()] || [];

      return {
        ...customer,
        orders: customerOrders,
        transactions: customerOrders.map((order) => ({
          _id: order._id,
          orderId: order._id,
          amount: order.totalAmount,
          method: order.paymentMethod,
          status: order.paymentStatus,
          stripeSessionId: order.stripeSessionId,
          date: order.createdAt,
        })),
      };
    });

    res.status(200).json({ customers: customersWithOrders });
  } catch (e) {
    res.status(500).json({ name: e.name, message: e.message });
  }
};

module.exports = { showAllCustomers };
