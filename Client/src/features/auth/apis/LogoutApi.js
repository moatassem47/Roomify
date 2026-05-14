import api from "../../../utils/axios"


const LogoutApi=async()=>{
    try{
       const res= await api.post("auth/logout")
       return res.data
    }catch(e){
        throw e.response?.data || e.message;
    }
}

export default LogoutApi