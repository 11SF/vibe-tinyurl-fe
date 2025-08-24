const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface LoginRequest {
  email: string
  password: string
  customAttr: string
}

export interface LoginResponse {
  code: string
  message: string
  data: {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    user_info: {
      username: string
      email: string
      picture_profile: string
    }
  }
}

export interface UserInfo {
  username: string
  email: string
  picture_profile: string
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    console.log('AuthService.login called with:', data)
    console.log('API URL:', `${API_BASE_URL}/v1/auth/login`)
    
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const result = await response.json()
    console.log('Raw API response:', result)

    if (!response.ok) {
      console.error('Login error response:', result)
      throw new Error(result.message || 'Login failed')
    }

    // Check if login was successful based on backend's response format
    if (result.code !== '00000') {
      console.error('Login failed with code:', result.code, result.message)
      throw new Error(result.message || 'Login failed')
    }

    console.log('Login success response:', result)
    return result
  }

  async validateToken(token: string): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Token validation failed')
    }

    return response.json()
  }

  setToken(token: string): void {
    console.log('Setting accessToken to localStorage:', token)
    localStorage.setItem('accessToken', token)
    console.log('Stored accessToken:', localStorage.getItem('accessToken'))
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  removeToken(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
  }

  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  }

  getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }
}

export const authService = new AuthService()