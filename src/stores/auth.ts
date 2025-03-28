/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi, { type LoginCredentials, type ProfileData } from '@/data/auth'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const setTokens = (newAccessToken: string | null, newRefreshToken: string | null) => {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken

    if (newAccessToken) {
      localStorage.setItem('access_token', newAccessToken)
      user.value = jwtDecode(newAccessToken)
    } else {
      localStorage.removeItem('access_token')
      user.value = null
    }

    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken)
    } else {
      localStorage.removeItem('refresh_token')
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.login(credentials)
      setTokens(response.access_token, response.refresh_token)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.register(credentials)
      setTokens(response.access_token, response.refresh_token)
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
      setTokens(null, null)
    }
  }

  const getProfile = async () => {
    try {
      loading.value = true
      error.value = null
      const profile = await authApi.getProfile()
      user.value = { ...user.value, ...profile }
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
      if (err.response?.status === 404) {
        error.value = "You don't have a profile yet."
        user.value = null
      }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      loading.value = true
      error.value = null
      const profile = await authApi.updateProfile(data)
      user.value = { ...user.value, ...profile }
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (data: ProfileData) => {
    try {
      loading.value = true
      error.value = null
      const profile = await authApi.createProfile(data)
      user.value = { ...user.value, ...profile }
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create profile'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    createProfile,
  }
})
