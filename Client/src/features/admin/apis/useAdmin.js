import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCustomers, getDashboard, getOrders, updateOrderStatus } from "./AdminApis"

export const useDashboard=()=>{
    return useQuery({
        queryKey:["dashboard"],
        queryFn:getDashboard
    })
}

export const useCustomers = () => {
    return useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers
    })
}

export const useOrders = (params) => {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => getOrders(params)
    })
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
    })
}
