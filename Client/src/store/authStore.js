import { create } from "zustand";
import api from "../utils/axios";
import LogoutApi from "../features/auth/apis/LogoutApi";
import useCart from "./cartStore";

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isPopUp: false,
  popUpType: "login",
  openPopUp: (type) => set({ isPopUp: true, popUpType: type }),
  closePopUp: () => set({ isPopUp: false }),
  login: (user) => set({ user: user || null, isAuthenticated: true }),
  updateUser: (updatedUser) =>
    set((state) => ({
      user: {
        ...state.user,
        ...updatedUser,
      },
    })),
  logout: async () => {
    try {
      await LogoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false });
      useCart.getState().setTotalQuantity(0);
    }
  },
  checkAuth: async () => {
    try {
      const res = await api.get("/user");
      set({ user: res.data, isAuthenticated: true, isCheckingAuth: false });
    } catch (e) {
      console.log(e);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      useCart.getState().setTotalQuantity(0);
    }
  },
}));

export default useAuth;
