import {useQuery} from "@tanstack/react-query"
import { getDashboard } from "./AdminApis"


export const useDashboard=()=>{
    return useQuery({
        queryKey:["dashboard"],
        queryFn:getDashboard
    })
}