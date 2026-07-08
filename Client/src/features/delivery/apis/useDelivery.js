import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveryOrderById,
  getDeliveryOrders,
  markDeliveryDelivered,
  startDelivery,
} from "./deliveryApis";

export const deliveryKeys = {
  all: ["delivery"],
  orders: () => [...deliveryKeys.all, "orders"],
  order: (id) => [...deliveryKeys.orders(), id],
};

export const useDeliveryOrders = () => {
  return useQuery({
    queryKey: deliveryKeys.orders(),
    queryFn: getDeliveryOrders,
  });
};

export const useDeliveryOrder = (id) => {
  return useQuery({
    queryKey: deliveryKeys.order(id),
    queryFn: () => getDeliveryOrderById(id),
    enabled: !!id,
  });
};



export const useStartDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startDelivery,
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: deliveryKeys.order(orderId) });
      }
    },
  });
};

export const useMarkDeliveryDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => markDeliveryDelivered(id),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: deliveryKeys.order(orderId) });
      }
    },
  });
};