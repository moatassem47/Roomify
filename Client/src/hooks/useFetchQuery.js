import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

const fetchData = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

const useFetchQuery = (endpoint, key, options = {}) => {
  const { selectData, ...queryOptions } = options;

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const data = await fetchData(endpoint);
      return selectData ? selectData(data) : data;
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
    ...queryOptions,
  });
};

export default useFetchQuery;
