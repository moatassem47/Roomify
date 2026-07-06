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
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.order(id) });
    },
  });
};

export const useMarkDeliveryDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markDeliveryDelivered,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.order(id) });
    },
  });
};
