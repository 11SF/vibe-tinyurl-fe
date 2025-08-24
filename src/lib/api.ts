import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  console.log('API Request interceptor - Found token:', !!token)
  console.log('API Request interceptor - Token value:', token ? token.substring(0, 20) + '...' : 'null')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('API Request interceptor - Added Authorization header')
  } else {
    console.log('API Request interceptor - No token found, skipping Authorization header')
  }
  
  const userId = localStorage.getItem('user_id')
  if (userId) {
    config.headers['X-User-ID'] = userId
  }
  
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user_id')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface CreateURLRequest {
  url: string
  custom_alias?: string
  expires_at?: string
}

export interface URLResponse {
  id: string
  short_code: string
  short_url: string
  original_url: string
  custom_alias?: string
  click_count?: number
  expires_at?: string
  created_at: string
  updated_at?: string
}

export interface ClickData {
  id: string
  ip_address: string
  user_agent: string
  referer?: string
  created_at: string
}

export const urlService = {
  createURL: async (data: CreateURLRequest) => {
    const response = await api.post('/api/tinyurl/v1/shorten', data)
    return response.data
  },

  getUserURLs: async (limit = 20, offset = 0) => {
    const response = await api.get(`/api/tinyurl/v1/urls?limit=${limit}&offset=${offset}`)
    return response.data
  },

  updateURL: async (data: { id: string } & CreateURLRequest) => {
    const response = await api.put('/api/tinyurl/v1/urls', data)
    return response.data
  },

  deleteURL: async (id: string) => {
    const response = await api.delete(`/api/tinyurl/v1/urls/${id}`)
    return response.data
  },

  getAnalytics: async (id: string, limit = 20, offset = 0) => {
    const response = await api.get(`/api/tinyurl/v1/analytics/${id}?limit=${limit}&offset=${offset}`)
    return response.data
  },
}

export interface LoginRequest {
  email: string
  password: string
  customAttr: string
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },
}