import { create } from 'zustand'
import api from '../lib/api'

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
      const { data } = await api.get('/auth/me')
      set({ user: data.user, loading: false })
    } catch {
      localStorage.clear()
      set({ loading: false })
    }
  },

  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.clear()
    set({ user: null })
  }
}))

export default useAuthStore