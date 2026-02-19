import type { AdminAuthResponse, TokenRefreshResponse } from '@sokol111/ecommerce-auth-service-api'
import type { H3Event } from 'h3'
import {
  ACCESS_TOKEN_EXPIRES_AT_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY
} from '~/utils/auth/constants'

// Re-export constants for server auto-import
export {
  ACCESS_TOKEN_EXPIRES_AT_KEY, ACCESS_TOKEN_KEY, isTokenExpired, REFRESH_TOKEN_KEY, TOKEN_EXPIRY_BUFFER_MS
} from '~/utils/auth/constants'

export function setAuthCookies(
  event: H3Event,
  response: TokenRefreshResponse | AdminAuthResponse
): void {
  const { cookieSecure } = useRuntimeConfig()
  const isSecure = Boolean(cookieSecure)
  const expiresAt = new Date(response.expiresAt).getTime()

  setCookie(event, ACCESS_TOKEN_KEY, response.accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: response.expiresIn
  })

  setCookie(event, REFRESH_TOKEN_KEY, response.refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: response.refreshExpiresIn
  })

  setCookie(event, ACCESS_TOKEN_EXPIRES_AT_KEY, expiresAt.toString(), {
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: response.expiresIn
  })
}

export function clearAuthCookies(event: H3Event): void {
  deleteCookie(event, ACCESS_TOKEN_KEY)
  deleteCookie(event, ACCESS_TOKEN_EXPIRES_AT_KEY)
  deleteCookie(event, REFRESH_TOKEN_KEY)
}
