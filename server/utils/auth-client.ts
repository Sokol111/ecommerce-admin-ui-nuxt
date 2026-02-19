import type {
  AdminAuthResponse,
  AdminUserProfile,
  LoginRequest,
  TokenRefreshResponse
} from '@sokol111/ecommerce-auth-service-api'
import { getAuthAPI } from '@sokol111/ecommerce-auth-service-api'
import type { H3Event } from 'h3'

const api = getAuthAPI()

export function useAuthClient(event: H3Event) {
  const { authApiUrl: baseURL } = useRuntimeConfig()
  const accessToken = getCookie(event, ACCESS_TOKEN_KEY)
  const refreshTokenValue = getCookie(event, REFRESH_TOKEN_KEY)

  function getAuthHeaders() {
    if (!accessToken) {
      throw createError({ statusCode: 401, message: 'Not authenticated' })
    }
    return { Authorization: `Bearer ${accessToken}` }
  }

  return {
    async login(credentials: LoginRequest): Promise<AdminAuthResponse> {
      const response = await api.adminLogin(credentials, { baseURL })
      return response.data
    },

    async getProfile(): Promise<AdminUserProfile> {
      const response = await api.adminGetProfile({
        baseURL,
        headers: getAuthHeaders()
      })
      return response.data
    },

    async refreshToken(): Promise<TokenRefreshResponse> {
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }
      const response = await api.tokenRefresh({ refreshToken: refreshTokenValue }, { baseURL })
      return response.data
    },

    async logout(): Promise<void> {
      await api.adminLogout({
        baseURL,
        headers: getAuthHeaders()
      })
    }
  }
}

export type AuthClient = ReturnType<typeof useAuthClient>
