import { create } from "zustand";
import api from "../utils/axios";
import LogoutApi from "../features/auth/apis/LogoutApi";
import useCart from "./cartStore";

const normalizeUser = (user) => {
  if (!user) return user;

  return {
    ...user,
    isVerified:
      user.role === "admin" || user.role === "delivery" || Boolean(user.isVerified),
  };
};

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isPopUp: false,
  popUpType: "login",
  openPopUp: (type) => set({ isPopUp: true, popUpType: type }),
  closePopUp: () => set({ isPopUp: false }),
  login: (user) => set({ user: normalizeUser(user), isAuthenticated: true }),
  updateUser: (updatedUser) =>
    set((state) => ({
      user: normalizeUser({
        ...state.user,
        ...updatedUser,
      }),
    })),
  logout: async () => {
    set({ user: null, isAuthenticated: false });

    useCart.getState().setTotalQuantity(0);

    try {
      await LogoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
  checkAuth: async () => {
    try {
      const res = await api.get("/user");
      set({ user: normalizeUser(res.data), isAuthenticated: true, isCheckingAuth: false });
    } catch (e) {
      console.log(e);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      useCart.getState().setTotalQuantity(0);
    }
  },
}));

export default useAuth;
