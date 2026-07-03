import {useMutation, useQueryClient} from "@tanstack/react-query"
import { addToCart, deleteItem, updateQuantity } from "./cartApis"
import useCart from "../../../store/cartStore";
import toast from 'react-hot-toast';
import useFetchQuery from "../../../hooks/useFetchQuery";

export const useAddToCart=()=>{
     const { setTotalQuantity} = useCart();
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({ productId, quantity })=>addToCart(productId,quantity),
        onSuccess:(data)=>{
            toast.success(data.message, {
                duration:2000,
                position:"bottom-center",
                style: {
                    border: '1px solid #713200',
                    padding: '16px',
                    color: '#713200',
                },
                iconTheme: {
                    primary: '#713200',
                    secondary: '#FFFAEE',
                },

                });
                
            if(data.totalQuantity !== undefined){
                setTotalQuantity(data.totalQuantity)
            }
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
           onError: (error) => {
            console.log(error)
            toast.error(error.message || "Failed to add to cart");
        }
    })
}

export const useGetCart = (options = {}) => {
    const { setTotalQuantity } = useCart();
    return useFetchQuery("/cart", ["cart"], {
        selectData: (data) => {
            if (data?.cart?.items) {
                const total = data.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                setTotalQuantity(total);
            } else {
                setTotalQuantity(0);
            }
            return data;
        },
        ...options
    });
};

export const useDeleteItem=()=>{
    const { setTotalQuantity } = useCart();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(productId)=>deleteItem(productId),
        onSuccess:(data)=>{
            toast.success(data.message, {
                duration:2000,
                position:"bottom-center",
                style: {
                    border: '1px solid #713200',
                    padding: '16px',
                    color: '#713200',
                },
                iconTheme: {
                    primary: '#713200',
                    secondary: '#FFFAEE',
                },

                });
            if(data.totalQuantity !== undefined){
                setTotalQuantity(data.totalQuantity)
            }
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
           onError: (error) => {
          
            toast.error(error.message || "Failed to remove item");
        }
    })
}

export const useUpdateQuantity=()=>{
    const { setTotalQuantity } = useCart();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({productId,action})=>updateQuantity(productId,action),
        onSuccess:(data)=>{
           
            if(data.totalQuantity !== undefined){
                setTotalQuantity(data.totalQuantity)
            }
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
           onError: (error) => {
           console.log(error)
            toast.error(error.message || "Failed to remove item");
        }
    })
}
