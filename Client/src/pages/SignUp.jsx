import RegisterForm from "../features/auth/components/RegisterForm"
import RegisterWallpaper from "../features/auth/components/RegisterWallpaper"
import { motion } from "framer-motion";
const SignUp = () => {
  return (
    
   <motion.div className="flex min-h-screen w-full flex-col bg-brand-cream px-4 py-6 sm:px-6  lg:h-screen lg:flex-row lg:overflow-hidden lg:p-0" initial={{opacity:0,y:-50}}
    animate={{opacity:1,y:0}}
    exit={{opacity:0,y:50}}
    transition={{duration:0.35}}>
    <RegisterWallpaper/>
      <div className="flex flex-1 items-stretch justify-center bg-white lg:block">
       <RegisterForm/>

      </div>
    
   </motion.div>
    
  )
}

export default SignUp
