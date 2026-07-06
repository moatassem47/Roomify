import { Navigate } from "react-router-dom"
import useAuth from "../../store/authStore"
import { useEffect } from "react"

const ProtectedRoute = ({children}) => {
  const { isAuthenticated,isCheckingAuth, openPopUp, user } = useAuth()
  const isVerified = user?.role === "admin" || user?.role === "delivery" || user?.isVerified;
  
  useEffect(() => {
    if (!isAuthenticated&&!isCheckingAuth) {
      openPopUp("login")
      
    }
  }, [isAuthenticated, openPopUp,isCheckingAuth])

  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth && !isVerified) {
      openPopUp("verifyEmail")
    }
  }, [isAuthenticated, isCheckingAuth, isVerified, openPopUp])

  if (isCheckingAuth) {
    return null;
  }

  if(!isAuthenticated){
    return <Navigate to={"/"} replace />
  }

  if (!isVerified) {
    return <Navigate to={"/"} replace />
  }

  return children;
}

export default ProtectedRoute
