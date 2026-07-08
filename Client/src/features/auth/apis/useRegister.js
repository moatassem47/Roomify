import { useMutation } from "@tanstack/react-query"
import SignUp from "./RegisterApi"




const useRegister=()=>{

    return useMutation({
        mutationFn:(userData)=>SignUp(userData)
    })
}

export default useRegister