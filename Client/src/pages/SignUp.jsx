import RegisterForm from "../features/auth/components/RegisterForm"
import RegisterWallpaper from "../features/auth/components/RegisterWallpaper"
import { motion } from "framer-motion";
const SignUp = () => {
  return (
    
   <motion.div className="flex flex-row h-screen w-screen overflow-hidden bg-brand-cream" initial={{opacity:0,y:-50}}
    animate={{opacity:1,y:0}}
    exit={{opacity:0,y:50}}
    transition={{duration:0.35}}>
    <RegisterWallpaper/>
      <div className="flex-1 bg-white flex justify-center items-center p-6">
       <RegisterForm/>

      </div>
    
   </motion.div>
    
  )
}

export default SignUp
