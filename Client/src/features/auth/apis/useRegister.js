import { useMutation } from "@tanstack/react-query"
import SignUp from "./RegisterApi"

import useAuth from "../../../store/authStore";


const useRegister=()=>{

   const {openPopUp}=useAuth()
    return useMutation({
        mutationFn:(userData)=>SignUp(userData),
        onSuccess: (data) => {
            console.log("Registration successful! Response data:", data);
            openPopUp("login")
        }
    })
}

export default useRegister