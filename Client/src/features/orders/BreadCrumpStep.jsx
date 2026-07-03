import { motion } from "framer-motion";
import { Check } from "lucide-react";

const BreadCrumpStep = ({ title, date, completed, isCurrent }) => {
  const renderIcon = () => {
    if (completed)
      return (
        <div className="relative z-10 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center">
          <Check size={16} />
        </div>
      );

    if (isCurrent)
      return (
        <div className="relative z-10 w-6 h-6 rounded-full bg-secondary-container border-2 border-secondary text-secondary flex items-center justify-center">
          {" "}
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>{" "}
        </div>
      );

    return (
      <div className="relative z-10 w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center">
        <div className="w-2 h-2 bg-outline-variant rounded-full"></div>{" "}
      </div>
    );
  };

  return (
    <div className="relative flex gap-md pb-md">
      <div className="absolute -top-11 left-0.5  w-1 h-12 ml-2 bg-surface-variant">
        <motion.div
          className="w-full h-full bg-secondary"
          initial={{ height: "0%" }}
          animate={{ height: completed ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
      {renderIcon()}
      <div>
        <p className="font-label-md text-body-md">{title}</p>
        {date && <p className="text-on-surface-variant text-xs">{date}</p>}
      </div>
    </div>
  );
};

export default BreadCrumpStep;
