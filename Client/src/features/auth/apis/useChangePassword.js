import { useMutation } from "@tanstack/react-query";
import ChangePasswordApi from "./ChangePasswordApi";

const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) => ChangePasswordApi({ token, password }),
  });
};

export default useChangePassword;
