import { useMutation } from "@tanstack/react-query";
import LoginApi from "./LoginApi";
import useAuth from "../../../store/authStore";



const useLogin=()=>{
    const {login,closePopUp}=useAuth()
   
    return useMutation({
        mutationFn:(userData)=>LoginApi(userData),
        onSuccess:(data)=>{
            console.log(`you logged in Succefully `,data)
            login(data?.data)
            closePopUp()
        }
    })
}

export default useLogin