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
            login()
            if(data?.data?.role=="admin"){
                navigate("/admin")
            }
            window.location.reload();
            closePopUp()
        }
    })
}

export default useLogin