import { useMutation } from "@tanstack/react-query";
import LoginApi from "./LoginApi";
import useAuth from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { getRoleHome } from "../../../utils/roleRoutes";


const useLogin=()=>{
    const {login,closePopUp,checkAuth}=useAuth()
    const navigate=useNavigate()
    return useMutation({
        mutationFn:(userData)=>LoginApi(userData),
        onSuccess:async(data)=>{
            const user=data?.data
            login(user)
            closePopUp()
            navigate(getRoleHome(user?.role), { replace: true })
            await checkAuth()
        }
    })
}

export default useLogin
