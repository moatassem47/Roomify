import LoginForm from "../features/auth/components/LoginForm"
import { motion} from "framer-motion";

const Login = () => {
  return (

      <motion.div className='flex justify-center items-center h-screen w-screen lg:bg-gray-100/90' initial={{opacity:0,y:-50}}
      animate={{opacity:1,y:0}}
      exit={{opacity:0,y:50}}
      transition={{duration:0.35}}>
          <LoginForm/>
      </motion.div>

  )
}

export default Login