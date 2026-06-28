import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  CircleCheck,
  Truck,
  ShoppingCart,
  Users,
  Wallet,
  Package,
} from "lucide-react";

const KPISDashboard = ({ KPIS }) => {
  const cards = [
    {
      title: "Total Orders",
      value: KPIS.totalOrders,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Orders Delivered",
      value: KPIS.totalDeliveredOrders,
      icon: CircleCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      progress:
        (KPIS.totalDeliveredOrders / KPIS.totalOrders) * 100 || 0,
    },
    {
      title: "In Progress",
      value: KPIS.inProgress,
      icon: Truck,
      color: "text-amber-600",
      bg: "bg-amber-50",
      progress: (KPIS.inProgress / KPIS.totalOrders) * 100 || 0,
    },
    {
      title: "Revenue",
      value: KPIS.totalRevenue,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      suffix: " E£",
    },
    {
      title: "Products",
      value: KPIS.totalProducts,
      icon: ShoppingCart,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Users",
      value: KPIS.totalUsers,
      icon: Users,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-ambient border border-stone-100"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-stone-500 font-medium">
                {card.title}
              </span>

              <div
                className={`p-2 rounded-xl ${card.bg}`}
              >
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>

            <div className="text-3xl font-bold">
              <CountUp.default
                end={card.value}
                duration={2}
                enableScrollSpy
                scrollSpyOnce
              />
              {card.suffix}
            </div>

            {card.progress !== undefined && (
              <div className="mt-4">
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(card.progress, 100)}%`,
                    }}
                    transition={{ duration: 1.2 }}
                    className={`h-full ${
                      card.title === "Orders Delivered"
                        ? "bg-green-600"
                        : "bg-amber-500"
                    }`}
                  />
                </div>

                <p className="text-xs text-stone-400 mt-1">
                  {card.progress.toFixed(0)}%
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPISDashboard;