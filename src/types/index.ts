export interface User {
  id: string
  username: string
  email: string
  picture_profile: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user_info: User
}

export interface URL {
  id: string
  short_code: string
  short_url: string
  original_url: string
  custom_alias?: string
  user_id?: string
  click_count: number
  expires_at?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface URLClick {
  id: string
  url_id: string
  ip_address: string
  user_agent: string
  referer?: string
  created_at: string
}

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export type Theme = 'dark' | 'light'
export type NeonColor = 'cyan' | 'purple' | 'green' | 'pink' | 'yellow'