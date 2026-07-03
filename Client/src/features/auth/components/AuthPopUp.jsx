
import useAuth from '../../../store/authStore'
import Login from "../../../pages/Login"
import SignUp from "../../../pages/SignUp"
import { X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const AuthPopUp = () => {
    const { popUpType, closePopUp } = useAuth()
    
  return (
    <motion.div 
      className='fixed top-0 bottom-0 right-0 left-0 z-20 bg-black/20 backdrop-blur-sm'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
      {
        popUpType == "login" &&
        <Login key="login" />
      }
      {
        popUpType == "signUp" &&
        <SignUp key="signup" />
      }
      </AnimatePresence>

      <div 
        onClick={closePopUp}
        className='fixed top-25 right-8 z-25 p-3 bg-brand-cedar rounded-full cursor-pointer shadow-2xl hover:scale-110 transition-all border-2 border-white'
        >
        <X className='text-white' size={28} />
      </div>
    </motion.div>
  )
}

export default AuthPopUp