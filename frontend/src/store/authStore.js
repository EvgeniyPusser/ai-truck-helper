import { create } from 'zustand'
import { API_LOGIN } from "../config.js";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem("holly_token"),
  isLoading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      //const response = await fetch('/api/auth/login', {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      localStorage.setItem("holly_token", data.token);
      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("holly_token");
    set({
      user: null,
      token: null,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { token } = get();
    return !!token;
  },
}));

export default useAuthStore
