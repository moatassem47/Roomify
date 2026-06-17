import api from "../../../utils/axios"

export const getNewArrival=async()=>{
    try{

            const res= await api.get(`/products?sort=newest&limit=5`)
            return res.data.docs
    }catch(e){
          throw e.response?.data || e.message;
    }
}

export const GetProducts=async({search="",minPrice="",maxPrice="",sort="",page="",limit="",category=""} = {})=>{
    try{
        const res= await api.get(`/products?sort=${sort}&limit=${limit}&maxPrice=${maxPrice}&minPrice=${minPrice}&search=${search}&page=${page}&category=${category}`)
        return res.data
    }catch(e){
        throw e.response?.data || e.message;
    }
}

export const GetProductByID=async(id)=>{
    try{
        const res= await api.get(`/products/${id}`)
        return res.data
    }catch(e){
        throw e.response?.data || e.message;
    }
}


export const suggestedProducts=async(category,ProductId)=>{
    try{
        const res=await api.get(`/products?category=${category}&limit=5`)
        const products=res.data?.docs || []
        const filteredProduct=products.filter((product)=>product._id!==ProductId)
        return { docs: filteredProduct.slice(0,4) }
    }catch(e){
        throw e.response?.data || e.message;
    }
}