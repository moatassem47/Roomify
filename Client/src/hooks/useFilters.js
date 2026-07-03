import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"


const useFilters=(filterKeys=[])=>{
    const [searchParams,setSearchParams]=useSearchParams()

     const currentFilters = filterKeys.reduce((acc, key) => {
        const value = searchParams.get(key)
        acc[key] = value || "" 
        return acc
    }, {})

     const setFilters=useCallback((filters)=>{
         setSearchParams((params)=>{
            Object.entries(filters).forEach(([key,value])=>{
                if(value===null||value===""||value===undefined||
                    Array.isArray(value)&& value.length===0
                ){
                    params.delete(key)
                }else if (Array.isArray(value)){
                    params.set(key,value.join(","))
                }
                else{
                    params.set(key,value)
                }
            })
            return params
         })
     },[setSearchParams])
     
     const clearFilters = useCallback(() => setSearchParams({}), [setSearchParams]);
     return(
        {
        currentFilters,
        setFilters,
        clearFilters
        }
     )
}

export default useFilters