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
  },

  register: async (formData) => {
  const { data } = await api.post('/auth/register', formData)
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  set({ user: data.user })
  return data
  },
  
}))

export default useAuthStore