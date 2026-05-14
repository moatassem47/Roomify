import {useQuery} from "@tanstack/react-query"
import { getNewArrival ,GetProducts,GetProductByID, suggestedProducts } from "./productApis"

export const useNewArrival=()=>{
    return useQuery({
        queryKey:["products","new_arrivals"],
        queryFn:getNewArrival
    })
}

export const useGetProducts=(filters = {})=>{
    return useQuery({
        queryKey:["products", filters],
        queryFn:()=>GetProducts(filters),
        staleTime: 1000 * 60 * 2,
        placeholderData:(prev)=>prev   
    })
}

export const useGetSindgleProduct=(id)=>{
    return useQuery({
        queryKey:["products", id],
        queryFn:()=>GetProductByID(id),
        staleTime: 1000 * 60 * 2,  
    })
}

export const useSuggestProduct=(category,productId)=>{
return useQuery({
        queryKey:["products", "suggested",category],
        queryFn:()=>suggestedProducts(category,productId),
        enabled:!!category
    })
}