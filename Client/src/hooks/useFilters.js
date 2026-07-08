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
            const nextParams = new URLSearchParams(params)
            Object.entries(filters).forEach(([key,value])=>{
                if(value===null||value===""||value===undefined||
                    Array.isArray(value)&& value.length===0
                ){
                    nextParams.delete(key)
                }else if (Array.isArray(value)){
                    nextParams.set(key,value.join(","))
                }
                else{
                    nextParams.set(key,value)
                }
            })
            return nextParams
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
