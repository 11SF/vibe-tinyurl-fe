import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { urlService, type CreateURLRequest, type URLResponse, type ClickData } from '@/lib/api'

// Query Keys
export const URL_QUERY_KEYS = {
  all: ['urls'] as const,
  lists: () => [...URL_QUERY_KEYS.all, 'list'] as const,
  list: (limit: number, offset: number) => [...URL_QUERY_KEYS.lists(), { limit, offset }] as const,
  details: () => [...URL_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...URL_QUERY_KEYS.details(), id] as const,
  analytics: (id: string, limit: number, offset: number) => 
    [...URL_QUERY_KEYS.all, 'analytics', id, { limit, offset }] as const,
} as const

// Fetch user URLs
export function useUserURLs(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: URL_QUERY_KEYS.list(limit, offset),
    queryFn: () => urlService.getUserURLs(limit, offset),
    select: (data) => data.data as URLResponse[],
    enabled: true,
  })
}

// Create new URL
export function useCreateURL() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateURLRequest) => urlService.createURL(data),
    onSuccess: (response) => {
      // Invalidate and refetch user URLs
      queryClient.invalidateQueries({ queryKey: URL_QUERY_KEYS.lists() })
      
      return response.data as URLResponse
    },
    onError: (error: any) => {
      console.error('Failed to create URL:', error)
    },
  })
}

// Update URL
export function useUpdateURL() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string } & CreateURLRequest) => urlService.updateURL(data),
    onSuccess: (response, variables) => {
      // Invalidate URL lists
      queryClient.invalidateQueries({ queryKey: URL_QUERY_KEYS.lists() })
      
      // Update specific URL cache if it exists
      const urlData = response.data as URLResponse
      queryClient.setQueryData(
        URL_QUERY_KEYS.detail(variables.id),
        { data: urlData }
      )
    },
    onError: (error: any) => {
      console.error('Failed to update URL:', error)
    },
  })
}

// Delete URL
export function useDeleteURL() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => urlService.deleteURL(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: URL_QUERY_KEYS.detail(deletedId) })
      
      // Invalidate URL lists to refetch
      queryClient.invalidateQueries({ queryKey: URL_QUERY_KEYS.lists() })
    },
    onError: (error: any) => {
      console.error('Failed to delete URL:', error)
    },
  })
}

// Get analytics for a URL
export function useURLAnalytics(id: string, limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: URL_QUERY_KEYS.analytics(id, limit, offset),
    queryFn: () => urlService.getAnalytics(id, limit, offset),
    select: (data) => data.data as ClickData[],
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
  })
}

// Prefetch user URLs (useful for navigation)
export function usePrefetchUserURLs() {
  const queryClient = useQueryClient()

  return (limit: number = 20, offset: number = 0) => {
    queryClient.prefetchQuery({
      queryKey: URL_QUERY_KEYS.list(limit, offset),
      queryFn: () => urlService.getUserURLs(limit, offset),
      staleTime: 5 * 60 * 1000,
    })
  }
}

// Get cached URL data without making a request
export function useURLData(id: string) {
  const queryClient = useQueryClient()
  
  return queryClient.getQueryData(URL_QUERY_KEYS.detail(id))
}

// Get URL by short code (for redirect page)
export function useURLByShortCode(shortCode: string) {
  return useQuery({
    queryKey: ['url', 'shortCode', shortCode],
    queryFn: async () => {
      // This will call the backend redirect endpoint but with a special header to get JSON instead of redirect
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/${shortCode}`, {
        headers: {
          'Accept': 'application/json',
          'X-Preview-Mode': 'true', // Custom header to indicate we want preview, not redirect
        },
      })
      
      if (!response.ok) {
        throw new Error('URL not found or expired')
      }
      
      return response.json()
    },
    enabled: !!shortCode,
    retry: false, // Don't retry on 404
    staleTime: 0, // Always fresh for security
  })
}