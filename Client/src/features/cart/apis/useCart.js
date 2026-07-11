import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../store/authStore";
import {
  getCartItems,
  addItem,
  removeItem,
  updateItemQuantity,
  computeTotals,
  clearCart as clearCartStorage,
} from "../../../utils/cartStorage";

const toastStyle = {
  duration: 2000,
  position: "bottom-center",
  style: {
    border: "1px solid #713200",
    padding: "16px",
    color: "#713200",
  },
  iconTheme: {
    primary: "#713200",
    secondary: "#FFFAEE",
  },
};

// ─── helpers ────────────────────────────────────────────────────────────────

/** Build the same data shape that the old API returned so all consumers work */
const buildCartData = (items) => {
  const { totalQuantity, totalPrice } = computeTotals(items);
  return {
    cart: { items },
    totalPrice,
    totalQuantity,
  };
};

// ─── hooks ───────────────────────────────────────────────────────────────────

export const useGetCart = (options = {}) => {
  const userId = useAuth((s) => s.user?._id);

  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => {
      const items = getCartItems(userId);
      return buildCartData(items);
    },
    // Re-run whenever userId changes; disable when no user
    enabled: options.enabled !== undefined ? options.enabled : Boolean(userId),
    // Always treat as fresh – storage is synchronous so no staleTime needed
    staleTime: 0,
    ...options,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const userId = useAuth((s) => s.user?._id);

  return useMutation({
    mutationFn: ({ product, quantity }) => {
      const items = addItem(userId, product, quantity);
      return buildCartData(items);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", userId], data);
      toast.success("Item added to cart", toastStyle);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.message || "Failed to add to cart");
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const userId = useAuth((s) => s.user?._id);

  return useMutation({
    mutationFn: (productId) => {
      const items = removeItem(userId, productId);
      return buildCartData(items);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", userId], data);
      toast.success("Item removed from cart", toastStyle);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to remove item");
    },
  });
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  const userId = useAuth((s) => s.user?._id);

  return useMutation({
    mutationFn: ({ productId, action }) => {
      const items = updateItemQuantity(userId, productId, action);
      return buildCartData(items);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", userId], data);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.message || "Failed to update quantity");
    },
  });
};

/** Utility: clear the whole cart (called after successful checkout) */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const userId = useAuth((s) => s.user?._id);

  return () => {
    clearCartStorage(userId);
    queryClient.setQueryData(["cart", userId], buildCartData([]));
  };
};