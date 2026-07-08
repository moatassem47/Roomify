import LoginForm from "../features/auth/components/LoginForm"
import { motion} from "framer-motion";

const Login = () => {
  return (

   <motion.div
  className="relative flex py-10 w-full  justify-center overflow-hidden bg-linear-to-br from-[#f8f5f1] via-[#f3ede5] to-[#ece4da]"
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.35 }}
>

  <LoginForm />
</motion.div>

  )
}

export default Login