import {  RotateCcw } from "lucide-react"
import useFilters from "../../hooks/useFilters"




const OrderFilters = () => {
 
    const {clearFilters,currentFilters,setFilters}=useFilters(["status","startDate","endDate"])
    
  return (
    
      <section className="sticky top-18 z-40 mb-6">
        <div className="bg-surface-container/80 backdrop-blur-md rounded-xl p-3 tactile-shadow border border-[#e6e2db]/50 flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1 min-w-60">
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#84746c] px-1">
              Status
            </label>
            <select onChange={(e)=>setFilters({"status":e.target.value})}
             value={currentFilters.status || ""}
             className="bg-[#fef9f2] border-none rounded-lg  focus:ring-2 focus:ring-brand-cedar/20 cursor-pointer h-10">
              <option value="">All Orders</option>
              <option >Placed</option>
              <option>Packed</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-60">
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#84746c] px-1">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <input
                className="bg-[#fef9f2] border-none rounded-lg text-[14px]  font-bold focus:ring-2 focus:ring-brand-cedar/20 flex-1 h-10"
                type="date"
                value={currentFilters.startDate}
                onChange={(e)=>{
                 setFilters({startDate:e.target.value})
                }}
              />
              <span className="text-[#84746c]">to</span>
              <input
                className="bg-[#fef9f2] border-none rounded-lg text-[14px]  font-bold  focus:ring-2 focus:ring-brand-cedar/20 flex-1 h-10"
                type="date"
                value={currentFilters.endDate}
                onChange={(e)=>{
                 setFilters({endDate:e.target.value})
                }}
              />
            </div>
          </div>
          <div className="flex items-end h-full">
            <button className="flex items-center gap-1 px-6 py-2 text-brand-cedar text-[14px]  font-bold hover:bg-[#331200]/30 rounded-lg transition-colors h-10 mt-5"
            onClick={()=>clearFilters()}>
             <RotateCcw color=" #825032" />
              Reset Filters
            </button>
          </div>
        </div>
      </section>
  )
}

export default OrderFilters