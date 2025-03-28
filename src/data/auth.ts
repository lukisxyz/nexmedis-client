/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const API_URL = '' // TODO: Change This

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`)
  },

  async getProfile(): Promise<any> {
    const response = await axios.get(`${API_URL}/auth/profile`)
    return response.data
  },
}

// Axios interceptor for adding auth token to requests
axios.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default authApi
