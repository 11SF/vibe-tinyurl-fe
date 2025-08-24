'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService, type LoginRequest, type UserInfo } from '@/services/auth'
import { useState, useEffect } from 'react'
import { Klee_One } from 'next/font/google'
import { LucideLockKeyhole } from 'lucide-react'

const AUTH_QUERY_KEYS = {
  user: () => ['auth', 'user'] as const,
  validate: (token: string) => ['auth', 'validate', token] as const,
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      console.log('useLogin mutationFn called with:', data)
      const response = await authService.login(data)
      console.log('useLogin got response:', response)

      // Store tokens and user info
      if (response.code == "00000" && response.data) {

        console.log("DEBUGGGGG ", response.data.access_token);
        
        authService.setToken(response.data.access_token)
        authService.setRefreshToken(response.data.refresh_token)
        authService.setUserInfo(response.data.user_info)
        console.log('Stored tokens and user info')
      } else {
        console.error('No data in response:', response)
      }

      return response
    },
    onSuccess: (response) => {
      console.log('Login mutation onSuccess:', response)
      // Invalidate and refetch user data
      if (response.data) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.user(), response.data.user_info)
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user() })
      }
    },
    onError: (error) => {
      console.error('Login mutation onError:', error)
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Clear local storage
      authService.removeToken()
      return true
    },
    onSuccess: () => {
      // Clear React Query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user(), null)
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user() })
    },
  })
}

export function useCurrentUser() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(authService.getToken())
  }, [])

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user(),
    queryFn: async (): Promise<UserInfo | null> => {
      if (!token) {
        const storedUser = authService.getUserInfo()
        return storedUser
      }

      try {
        const userInfo = await authService.validateToken(token)
        authService.setUserInfo(userInfo)
        return userInfo
      } catch (error) {
        // Token is invalid, clear storage
        authService.removeToken()
        return null
      }
    },
    enabled: typeof window !== 'undefined', // Only run on client side
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser()
  return {
    isAuthenticated: !!user && !isLoading,
    isLoading,
    user,
  }
}

export function useAuth() {
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const { data: user, isLoading } = useCurrentUser()
  const { isAuthenticated } = useIsAuthenticated()

  return {
    // User data
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Mutation states
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  }
}