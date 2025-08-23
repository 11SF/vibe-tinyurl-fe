import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type LoginRequest } from '@/lib/api'

// Auth mutation hooks
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Store tokens in localStorage
      const { access_token, refresh_token, user_info } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user_id', user_info.username) // or user ID
      
      // Clear all queries on successful login
      queryClient.clear()
      
      return response.data
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
      // Clear any stored tokens on error
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Clear tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
      
      // Clear all cached data
      queryClient.clear()
      
      return { success: true }
    },
  })
}

// Helper hooks
export function useAuthState() {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const userID = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
  
  return {
    isAuthenticated: !!accessToken,
    userID,
    accessToken,
  }
}