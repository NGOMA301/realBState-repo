import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:5000";
const authStore = (set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  requires2FA: false,
  tempToken: null,
  error: null,
  loading: true,

  login: async (email, password) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.requires2FA) {
        set({ requires2FA: true, tempToken: data.tempToken });
        return { requires2FA: true };
      }

      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === "admin",
        loading: false,
      });
      toast.success("Login successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  },

  verify2FA: async (code) => {
    try {
      const { tempToken } = useAuthStore.getState();
      const { data } = await axios.post(`${API_URL}/api/verify-2fa`, { tempToken, code }, { withCredentials: true });
  
  
      if (data.user) {
        set({ 
          isAuthenticated: true,
          requires2FA: false,
          tempToken: null,
          user: data.user,
          isAdmin: data.user.role === 'admin',
          error: null
        });
        toast.success("Verification successful");
        return true;
      }
  
      throw new Error(data.message || "Verification failed"); // Ensure proper error handling
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },
  
  logout: async () => {
    try {
      await axios.post(`${API_URL}/api/admin/logout`, {}, { withCredentials: true });
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        requires2FA: false,
        tempToken: null,
        loading: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  checkAuth: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/profile`, {
        withCredentials: true,
      });
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === "admin",
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  },
});

export const useAuthStore = create(devtools(authStore));
