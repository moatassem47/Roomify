import { useEffect, useState } from "react"

const useDebounce=(search)=>{
  const [debounceSearch,setDebounceSearch]=useState(search??"")
  
  useEffect(()=>{
    const timer=setTimeout(()=>{
        setDebounceSearch(search)
    },300)

    return ()=>clearTimeout(timer)
  },[search])
 
  return debounceSearch
}

export default useDebounce