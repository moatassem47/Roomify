import {useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter , FunnelX  } from "lucide-react";

const Filters = () => {
    const [openFilters,setOpenFilters]=useState(false)
    const [searchParams,setSearchParams]=useSearchParams()
    const [localSearch,setLocalSearch]=useState(searchParams.get("search")||"")
    const updateFilter=(key,value)=>{
        const params= new URLSearchParams(searchParams)

        if(value){
            params.set(key,value)
           
        }else{
            params.delete(key)
        }
        params.set("page", "1");
        setSearchParams(params)
        
    }

    useEffect(() => {
    const timer = setTimeout(() => {
        updateFilter("search", localSearch); // fires only if not cancelled
    }, 500);
    return () => clearTimeout(timer); 
}, [localSearch]);
    return (
        <div className=" p-6  mb-8 ">

           {!openFilters&&<div className="flex flex-row gap-4 relative items-center justify-center ">
                    <div className="relative w-200 flex justify-center">
                        <Search className="absolute  left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-surface-dim" />
                        <input 
                            type="search" 
                            placeholder="Search collection..."
                            value={localSearch}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm"
                            onChange={(e)=>setLocalSearch(e.target.value)}
                        />
                    </div>
                    <Filter className="w-6 h-6 text-brand-cedar" onClick={()=>setOpenFilters(!openFilters)} />
                </div>}
            
            {
                openFilters&&
                <>
                <div className="flex items-center gap-2 mb-6 text-brand-cedar font-serif text-xl">
                    <Filter className="w-6 h-6" />
                    <h2>Filter & Sort</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-6">
                    {/* Search */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-semibold text-brand-text font-sans">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-surface-dim" />
                            <input 
                                type="search" 
                                placeholder="Search collection..."
                                value={localSearch}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm"
                                  onChange={(e)=>setLocalSearch(e.target.value)}
                            />
                        </div>
                    
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-brand-text font-sans">Sort By</label>
                        <select 
                            className="w-full px-4 py-2.5 bg-white border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm appearance-none"
                              value={searchParams.get("sort")||""}
                              onChange={(e)=>updateFilter("sort",e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-brand-text font-sans">Price Range ($)</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={searchParams.get("minPrice")||""}
                                className="w-full px-4 py-2.5 bg-white border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm"
                                onChange={(e)=>updateFilter("minPrice",e.target.value)}
                            />
                            <span className="text-brand-surface-dim">-</span>
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={searchParams.get("maxPrice")||""}
                                className="w-full px-4 py-2.5 bg-white border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm"
                                onChange={(e)=>updateFilter("maxPrice",e.target.value)}
                            />
                            <FunnelX   className="w-16 h-16   text-brand-cedar" onClick={()=>setOpenFilters(!openFilters)} />
                        </div>
                    </div>
                </div>
                </>
            }
            

           
        </div>
    );
};

export default Filters;