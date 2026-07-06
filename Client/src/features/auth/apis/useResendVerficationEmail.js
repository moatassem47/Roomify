import  api  from "../../../utils/axios"
import { useMutation } from "@tanstack/react-query"


const ResendVerficationEmail=async(email)=>{
try{
   const res=await api.post(`/auth/resendVerificationEmail`,{ email })
    return res.data
}catch(e){
    throw e.response?.data || e.message;
}
}


const useResendVerficationEmail=()=>{

    return useMutation({
        mutationFn:(email)=>ResendVerficationEmail(email)
    })
}

export default useResendVerficationEmail
