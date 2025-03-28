/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi, { type LoginCredentials, type RegisterCredentials } from '@/data/auth'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      user.value = jwtDecode(newToken)
    } else {
      localStorage.removeItem('token')
      user.value = null
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.login(credentials)
      setToken(response.token)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.register(credentials)
      setToken(response.token)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setToken(null)
    }
  }

  const getProfile = async () => {
    try {
      loading.value = true
      error.value = null
      const profile = await authApi.getProfile()
      user.value = { ...user.value, ...profile }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
  }
})
