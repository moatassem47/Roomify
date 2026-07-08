import { create } from "zustand";
import api from "../utils/axios";
import LogoutApi from "../features/auth/apis/LogoutApi";

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
  popUpType: "verifyEmail",
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
    try {
      await LogoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    try {
      const res = await api.get("/user");
      set({ user: normalizeUser(res.data), isAuthenticated: true, isCheckingAuth: false });
    } catch (e) {
      console.log(e);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export default useAuth;
