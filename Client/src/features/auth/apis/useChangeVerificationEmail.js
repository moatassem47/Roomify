import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const changeVerificationEmail = async (email) => {
  try {
    const res = await api.patch("/auth/verification-email", { email });
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

const useChangeVerificationEmail = () => {
  return useMutation({
    mutationFn: (email) => changeVerificationEmail(email),
  });
};

export default useChangeVerificationEmail;
