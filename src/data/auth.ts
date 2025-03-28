/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const API_URL = 'http://103.175.217.181:8000/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface ProfileData {
  full_name: string
  phone_number: string
  address: string
}
// Function to convert object to form data string
const objectToFormData = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// Add request interceptor to add Authorization header and transform request data
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Transform request data to form-urlencoded format
    if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = objectToFormData(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Request new tokens
        const response = await axios.post<TokenResponse>(
          `${API_URL}/renew-token`,
          objectToFormData({ refresh_token: refreshToken }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )

        const { access_token, refresh_token } = response.data

        // Update tokens in localStorage
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        // Update the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        originalRequest.headers.Authorization = `Bearer ${access_token}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh token is invalid, logout the user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const authApi = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/login', credentials)
    const { access_token, refresh_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    return response.data
  },

  async register(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/register', credentials)
    const { access_token, refresh_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  async getProfile(): Promise<ProfileData> {
    const response = await api.get<ProfileData>('/profile')
    return response.data
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    const response = await api.put<ProfileData>('/profile', data)
    return response.data
  },

  async createProfile(data: ProfileData): Promise<ProfileData> {
    const response = await api.post<ProfileData>('/profile', data)
    return response.data
  },
}

export default authApi
