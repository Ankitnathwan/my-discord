import { create } from 'zustand'
import * as authService from "../services/authService";
import socket from "../lib/socket";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      set({ loading: false })
      return
    }
    try {
      const data = await authService.getMe();
      set({ user: data.user, loading: false });
    } catch {
      localStorage.clear()
      set({ loading: false })
    }
  },

  setUser: (user) => set({ user }),
  logout: () => {
    socket.disconnect();
    
    localStorage.clear()
    set({ user: null })
  },

  register: async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    set({ user: data.user })
    return data
  },

  login: async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    set({ user: data.user });
    return data;
  },

}))

export default useAuthStore