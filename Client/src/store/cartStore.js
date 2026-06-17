import { create } from "zustand";
import { persist } from 'zustand/middleware'

const useCart = create(persist((set) => ({
    totalQuantity: 0,
    increaseQuantity: (quantity) => set((state) => ({ 
        totalQuantity: state.totalQuantity + quantity 
    })),

    
    setTotalQuantity: (quantity) => set({ 
        totalQuantity: quantity 
    })
}),{name:"totalQuantity"}));

export default useCart;
