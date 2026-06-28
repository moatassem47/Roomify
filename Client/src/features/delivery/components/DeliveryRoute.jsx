import useAuth from "../../../store/authStore"
import { Navigate } from "react-router-dom"

const DeliveryRoute = ({children}) => {
 const {isAuthenticated,user}=useAuth()

 if(!isAuthenticated){
    return <Navigate to="/" replace />
  }

   if (user?.role !== "delivery") {
    return <Navigate to="/" replace />;
  }

  return children
}

export default DeliveryRoute
