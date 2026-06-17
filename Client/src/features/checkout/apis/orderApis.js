import api from "../../../utils/axios";




export const createCashOrder=async(data)=>{
    try{
       const res=await api.post("/order/add",data)
       return res.data
    }catch(e){
         throw e.response?.data || e.message;
    }
}

export const createCardOrder=async(data)=>{
    try{
       const res=await api.post("/order/create-checkout-session",data)
       return res.data
    }catch(e){
         throw e.response?.data || e.message;
    }
}

export const getOrderById=async(orderId)=>{
    try{
       const res=await api.get(`/order/${orderId}`)
       return res.data
    }catch(e){
         throw e.response?.data || e.message;
    }
}