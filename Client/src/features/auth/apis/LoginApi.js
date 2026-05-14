
import api from "../../../utils/axios";

const LoginApi=async(userData)=>{
    try{
        const res =await api.post("/auth/login",userData)
        return res.data
    }catch(e){
        throw e.response?.data || e.message;
    }
}

export default LoginApi