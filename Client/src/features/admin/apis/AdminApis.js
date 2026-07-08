import api from "../../../utils/axios"

export const getDashboard=async()=>{
    try{
        const res=await api.get("/admin/dashboard")
        return res.data
    }catch(e){
          throw e.response?.data || e.message;
    }
}

export const getCustomers = async () => {
    try {
        const res = await api.get("/admin/customers");
        return res.data;
    } catch (e) {
        throw e.response?.data || e.message;
    }
}

export const getOrders = async (params) => {
    try {
        const res = await api.get("/admin/orders", { params });
        return res.data;
    } catch (e) {
        throw e.response?.data || e.message;
    }
}

export const updateOrderStatus = async ({ id, status }) => {
    try {
        const res = await api.patch(`/admin/orders/${id}`, { status });
        return res.data;
    } catch (e) {
        throw e.response?.data || e.message;
    }
}
