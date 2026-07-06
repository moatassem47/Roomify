import api from "../../../utils/axios";

const ChangePasswordApi = async ({ token, password }) => {
  try {
    const res = await api.patch(`/auth/changePassword/${token}`, { password });
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export default ChangePasswordApi;
