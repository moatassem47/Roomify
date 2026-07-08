
import useAuth from '../../../store/authStore'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import RegisterVerifeyEmail from "./RegisterVerifeyEmail"

const AuthPopUp = () => {
    const  popUpType = useAuth((s)=>s.popUpType);
    const  closePopUp = useAuth((s)=>s.closePopUp);
    
  return (
    <motion.div 
      className='fixed top-0 bottom-0 right-0 left-0 z-60 bg-black/20 backdrop-blur-sm'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
      {
        popUpType == "verifyEmail" &&
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <RegisterVerifeyEmail key="verify-email"  />
          </div>
        </div>
      }
      </AnimatePresence>

      <div 
        onClick={closePopUp}
        className='fixed top-20 right-2 z-25 p-1  rounded-full cursor-pointer shadow-2xl hover:scale-110 transition-all '
        >
        <X className='text-black' size={24} />
      </div>
    </motion.div>
  )
}

export default AuthPopUp
