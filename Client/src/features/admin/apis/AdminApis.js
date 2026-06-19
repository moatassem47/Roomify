import api from "../../../utils/axios"


export const getDashboard=async()=>{
    try{
        const res=await api.get("/admin/dashboard")
        return res.data
    }catch(e){
          throw e.response?.data || e.message;
    }
}



