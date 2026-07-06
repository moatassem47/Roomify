import { useMutation } from "@tanstack/react-query";
import LoginApi from "./LoginApi";
import useAuth from "../../../store/authStore";
import { useNavigate } from "react-router-dom";


const useLogin=()=>{
    const {login,closePopUp}=useAuth()
    const navigate=useNavigate()
    return useMutation({
        mutationFn:(userData)=>LoginApi(userData),
        onSuccess:(data)=>{
            console.log(`you logged in Succefully `,data)
            login(data?.data)
            closePopUp()
            if(data?.data?.role=="admin"){
                navigate("/admin")
            }
        }
    })
}

export default useLogin
