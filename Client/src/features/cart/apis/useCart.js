import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addToCart, deleteItem, updateQuantity } from "./cartApis"
import toast from 'react-hot-toast';
import useFetchQuery from "../../../hooks/useFetchQuery";


const toastStyle = {
    duration: 2000,
    position: "bottom-center",
    style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#713200',
    },
    iconTheme: {
        primary: '#713200',
        secondary: '#FFFAEE',
    },
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
        onSuccess: (data) => {
            toast.success(data.message, toastStyle);
            
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to add to cart");
        }
    });
};

export const useGetCart = (options = {}) => {
    return useFetchQuery("/cart", ["cart"], {
        
        selectData: (data) => {
            const items = data?.cart?.items || [];
            const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            
            return {
                ...data,
                totalQuantity 
            };
        },
        ...options
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId) => deleteItem(productId),
        onSuccess: (data) => {
            toast.success(data.message, toastStyle);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to remove item");
        }
    });
};

export const useUpdateQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, action }) => updateQuantity(productId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to update quantity");
        }
    });
};