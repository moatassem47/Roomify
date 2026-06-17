import { Navigate } from "react-router-dom"
import useAuth from "../../store/authStore"
import { useEffect } from "react"

const ProtectedRoute = ({children}) => {
  const { isAuthenticated,isCheckingAuth, openPopUp } = useAuth()
  
  useEffect(() => {
    if (!isAuthenticated&&!isCheckingAuth) {
      openPopUp("login")
      
    }
  }, [isAuthenticated, openPopUp,isCheckingAuth])

  if(!isAuthenticated){
    return <Navigate to={"/"} replace />
  }

  return children;
}

export default ProtectedRoute