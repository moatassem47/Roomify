import { Truck, DollarSign, SquareKanban, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BreadCrump = ({ step ,setStep}) => {
  
  const iconVariants = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
  };

  const handleClick=(number)=>{
    if(step>number){
        setStep(number)
    }
  }
  return (
    <div className="flex items-center mb-10 w-full">
      
      <div className="w-10 h-1 bg-brand-cedar"></div>

      
      <div onClick={()=>handleClick(1)}
        className={`${
          step > 1 ? "bg-green-700" : "bg-brand-cedar"
        } size-12 rounded-full flex justify-center items-center relative transition-colors duration-300`}
      >
        <AnimatePresence mode="wait">
          {step > 1 ? (
            <motion.div key="check-1" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
              <Check color="#ffffff" />
            </motion.div>
          ) : (
            <motion.div key="truck" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
              <Truck color="#ffffff" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="text-sm text-brand-cedar absolute -bottom-6 font-medium whitespace-nowrap">
          Shipping
        </span>
      </div>

     
      <div className="flex-1 h-1 bg-brand-surface-dim relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-brand-cedar"
          initial={{ width: step > 2 ? "100%" : "0%" }}
          animate={{ width: step >= 2 ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      
      <div onClick={()=>handleClick(2)}
        className={`${
          step === 2 ? "bg-brand-cedar" : step < 2 ? "bg-brand-surface-dim" : "bg-green-700"
        } size-12 rounded-full flex justify-center items-center relative transition-colors duration-300`}
      >
        <AnimatePresence mode="wait">
          {step > 2 ? (
            <motion.div key="check-2" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
              <Check color="#ffffff" />
            </motion.div>
          ) : (
            <motion.div key="dollar" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
              <DollarSign color="#ffffff" />
            </motion.div>
          )}
        </AnimatePresence>
        <span
          className={`${
            step >= 2 ? "text-brand-cedar" : "text-brand-surface-dim"
          } text-sm absolute -bottom-6 font-medium transition-colors duration-300 whitespace-nowrap`}
        >
          Payment
        </span>
      </div>

     
      <div className="flex-1 h-1 bg-brand-surface-dim relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-brand-cedar"
          initial={{ width: "0%" }}
          animate={{ width: step === 3 ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      
      <div onClick={()=>handleClick(3)}
        className={`${
          step === 3 ? "bg-brand-cedar" : "bg-brand-surface-dim"
        } size-12 rounded-full flex justify-center items-center relative transition-colors duration-300`}
      >
        <SquareKanban color="#ffffff" />
        <span
          className={`${
            step === 3 ? "text-brand-cedar" : "text-brand-surface-dim"
          } text-sm absolute -bottom-6 font-medium transition-colors duration-300 whitespace-nowrap`}
        >
          Review
        </span>
      </div>
    </div>
  );
};

export default BreadCrump;