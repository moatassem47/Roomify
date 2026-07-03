
import api from "../../utils/axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
const ToggleWishlist = async (productID) => {
  try {
    const res = await api.post(`/user/wishlist/${productID}`);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};



const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ToggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
};

export default useToggleWishlist;
