const mongoose = require("mongoose");
const Order = require("../../model/orderSchema");
const User = require("../../model/userSchema");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const OrderdData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $facet: {
          totalOrders: [{ $count: "total" }],
          totalRevenue: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          top5Customers: [
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
          monthlyTrends: [
            {
              $group: { _id: { $month: "$createdAt" }, totalOrders: { $sum: 1 } },
            },
            { $sort: { _id: 1 } },
            { $project: { month: "$_id", totalOrders: 1, _id: 0 } },
          ]
        }
    
      }
    ]);

    const totalOrders = OrderdData[0].totalOrders[0]?.total || 0;
    const totalRevenue = OrderdData[0].totalRevenue[0]?.total || 0;
    const top5Customers = OrderdData[0].top5Customers || [];
    const monthlyTrends = OrderdData[0].monthlyTrends || [];

    const Dashboard = {
      KPIS: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        totalUsers: totalUsers,
      },
      Charts: {
        top5Customers: top5Customers,
        monthlyTrends: monthlyTrends,
      },
    };

    res.status(200).json(Dashboard);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports={getDashboardStats}

//Conversion Rate and Click-through rate هنحسبها بgoogle analytic في الفرونت اند
