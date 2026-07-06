import api from "../../../utils/axios";

export const getDeliveryOrders = async () => {
  try {
    const res = await api.get("/delivery");
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const getDeliveryOrderById = async (id) => {
  try {
    const res = await api.get(`/delivery/${id}`);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const startDelivery = async (id) => {
  try {
    const res = await api.patch(`/delivery/claim/${id}`);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const markDeliveryDelivered = async (id) => {
  try {
    const res = await api.patch(`/delivery/deliverd/${id}`);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};
