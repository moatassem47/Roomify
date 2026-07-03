import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
} from "./adminProductApis";

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

export const useAddAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAdminProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Product added", toastStyle);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
  });
};

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Product updated", toastStyle);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
};

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Product deleted", toastStyle);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
};
