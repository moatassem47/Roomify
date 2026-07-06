import api from "../../../utils/axios";

const ForgotPasswordApi = async (email) => {
  try {
    const res = await api.post("/auth/reset-password", { email });
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export default ForgotPasswordApi;
