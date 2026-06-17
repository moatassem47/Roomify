import {useMutation, useQuery} from "@tanstack/react-query"
import { createCardOrder, createCashOrder, getOrderById } from "./orderApis"
import { useNavigate } from "react-router-dom";

export const useCreateCashOrder=()=>{
    const navigate=useNavigate()
    return useMutation(
        {
            mutationFn:(data)=>createCashOrder(data),
            onSuccess:(res)=>{
                const orderId = res?.order?._id || "";
                navigate(`/checkout/success?orderId=${orderId}`)
            },
            onError:()=>{
                 navigate("/checkout/cancel")
            }
        }
    )
}

export const useCreateCardOrder=()=>{
    return useMutation(
        {
            mutationFn:(data)=>createCardOrder(data),
            onSuccess:(data)=>{
                window.location.href = data.url
            }
        }
    )
}

export const useGetOrderById=(orderId)=>{
    return useQuery({
        queryKey:["order",orderId],
        queryFn:()=>getOrderById(orderId),
        enabled:!!orderId
    })
}