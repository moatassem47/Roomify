import  api  from "../../../utils/axios"



const SignUp=async(user)=>{
try{
   const res=await api.post("/auth/register",user)
    return res.data
}catch(e){
    throw e.response?.data || e.message;
}
}

export default SignUp

