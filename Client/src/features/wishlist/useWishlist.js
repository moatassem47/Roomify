import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../store/authStore";
import {
  getWishlistItems,
  toggleWishlistItem,
} from "../../utils/wishlistStorage";

// ─── useGetWishlist ───────────────────────────────────────────────────────────
/** Returns the wishlist array from localStorage for the current user. */
export const useGetWishlist = () => {
  const userId = useAuth((s) => s.user?._id);

  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlistItems(userId),
    enabled: Boolean(userId),
    staleTime: 0,
  });
};

// ─── useToggleWishlist ────────────────────────────────────────────────────────
/**
 * Toggles a product in/out of the wishlist.
 * Callers pass the FULL product object (not just the ID) so we can store
 * product details for the Wishlist page display.
 *
 * ProductCard passes product._id – we accept either form:
 *   mutate(product)    – full object (preferred)
 *   mutate(productId)  – legacy string; will only toggle, not store details
 */
const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const userId = useAuth((s) => s.user?._id);

  return useMutation({
    mutationFn: (productOrId) => {
      // Support both calling styles
      const product =
        typeof productOrId === "object"
          ? productOrId
          : { _id: productOrId };
      const { items, added } = toggleWishlistItem(userId, product);
      return { items, added };
    },
    onSuccess: ({ items, added }) => {
      queryClient.setQueryData(["wishlist", userId], items);
      toast.success(
        added ? "Added to wishlist" : "Removed from wishlist",
        {
          duration: 2000,
          position: "bottom-center",
          style: { border: "1px solid #713200", padding: "16px", color: "#713200" },
          iconTheme: { primary: "#713200", secondary: "#FFFAEE" },
        }
      );
    },
    onError: (e) => {
      toast.error(e?.message || "Something went wrong");
    },
  });
};

export default useToggleWishlist;

