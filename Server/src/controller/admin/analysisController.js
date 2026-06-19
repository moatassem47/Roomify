const mongoose = require("mongoose");
const Order = require("../../model/orderSchema");
const User = require("../../model/userSchema");
const Product = require("../../model/productSchema");
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();
    const OrderdData = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "total" }],

          totalDeliveredOrders: [
            { $match: { status: "Delivered" } },
            { $count: "total" },
          ],
          inProgress: [
            { $match: { status: "Out for Delivery" } },
            { $count: "total" },
          ],

          totalRevenue: [
            { $match: { status: "Delivered" } }, // ✅
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          top5Customers: [
            { $match: { status: "Delivered" } }, // ✅
            {
              $group: { _id: "$userId", totalSpent: { $sum: "$totalAmount" } },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "customerInfo",
              },
            },
            { $unwind: "$customerInfo" },
            {
              $project: {
                _id: 0,
                name: {
                  $concat: [
                    "$customerInfo.firstName",
                    " ",
                    "$customerInfo.lastName",
                  ],
                },
                totalSpent: 1,
              },
            },
          ],
          dailyTrends: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                  day: { $dayOfMonth: "$createdAt" },
                },
                totalOrders: { $sum: 1 },
              },
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1,
              },
            },
            {
              $project: {
                _id: 0,
                date: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    { $toString: "$_id.month" },
                    "-",
                    { $toString: "$_id.day" },
                  ],
                },
                totalOrders: 1,
              },
            },
          ],
          orderStatusStats: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                status: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    const statuses = [
      "Placed",
      "Packed",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    const statusMap = Object.fromEntries(
      (OrderdData[0].orderStatusStats || []).map((item) => [
        item.status,
        item.count,
      ]),
    );
    const totalOrders = OrderdData[0].totalOrders[0]?.total || 0;
    const totalDeliveredOrders =
      OrderdData[0].totalDeliveredOrders[0]?.total || 0;
    const inProgress = OrderdData[0].inProgress[0]?.total || 0;

    const totalRevenue = OrderdData[0].totalRevenue[0]?.total || 0;
    const top5Customers = OrderdData[0].top5Customers || [];
    const dailyTrends = OrderdData[0].dailyTrends || [];
    const orderStatusStats = statuses.map((status) => ({
      status,
      count: statusMap[status] || 0,
    }));

    const Dashboard = {
      KPIS: {
        totalOrders: totalOrders,
        totalDeliveredOrders: totalDeliveredOrders,
        totalRevenue: totalRevenue,
        inProgress: inProgress,
        totalUsers: totalUsers,
        totalProducts: totalProducts,
      },
      Charts: {
        top5Customers: top5Customers,
        dailyTrends: dailyTrends,
        orderStatusStats: orderStatusStats,
      },
    };

    res.status(200).json(Dashboard);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = { getDashboardStats };

//Conversion Rate and Click-through rate هنحسبها بgoogle analytic في الفرونت اند
