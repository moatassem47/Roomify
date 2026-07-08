import { useMutation } from "@tanstack/react-query";
import ForgotPasswordApi from "./ForgotPasswordApi";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => ForgotPasswordApi(email),
  });
};

export default useForgotPassword;
