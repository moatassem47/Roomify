import api from "../../../utils/axios";


export const addToCart=async(productId,quantity)=>{
    try{
        const res=await api.post("/cart/add",{productId,quantity})
        return res.data
    }catch(e){
      throw e.response?.data || e.message;
    }
}


export const getCart=async()=>{
     try{
        const res=await api.get("/cart")
        return res.data
    }catch(e){
      throw e.response?.data || e.message;
    }
}

export const deleteItem=async(productID)=>{
     try{
        const res=await api.delete(`/cart/delete/${productID}`)
        return res.data
    }catch(e){
      throw e.response?.data || e.message;
    }
}

export const updateQuantity=async(productId,action)=>{
     try{
        const res=await api.patch("/cart/update",{productId,action})
        return res.data
    }catch(e){
      throw e.response?.data || e.message;
    }
}