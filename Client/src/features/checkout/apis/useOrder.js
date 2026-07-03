import {useMutation} from "@tanstack/react-query"
import { createCardOrder, createCashOrder } from "./orderApis"
import { useNavigate } from "react-router-dom";
import useFetchQuery from "../../../hooks/useFetchQuery";

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
    return useFetchQuery(`/order/${orderId}`, ["order",orderId], {
        enabled:!!orderId
    })
}
