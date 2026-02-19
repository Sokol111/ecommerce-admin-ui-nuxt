import type { AdminUserProfile } from '@sokol111/ecommerce-auth-service-api'
import {
  ACCESS_TOKEN_EXPIRES_AT_KEY,
  isTokenExpired
} from '~/utils/auth/constants'

export function useAuth() {
  const user = useState<AdminUserProfile | null>('auth:user', () => null)
  const isLoading = useState<boolean>('auth:loading', () => true)
  const isAuthenticated = computed(() => !!user.value)
  const tokenExpiresAtCookie = useCookie(ACCESS_TOKEN_EXPIRES_AT_KEY)
  const tokenExpiresAt = computed(() => {
    const value = tokenExpiresAtCookie.value
    return value ? parseInt(value, 10) : null
  })

  const refreshTokenExpiry = () => {
    if (import.meta.client) {
      refreshCookie(ACCESS_TOKEN_EXPIRES_AT_KEY)
    }
  }

  const getHeaders = (): HeadersInit | undefined => {
    if (import.meta.server) {
      const event = useRequestEvent()
      return event?.headers
    }
    return undefined
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      user.value = response.user
      refreshTokenExpiry()
      await navigateTo('/')
      return true
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore - clear state anyway
    }
    user.value = null
    refreshTokenExpiry()
    await navigateTo('/login')
  }

  const ensureAuthenticated = async (): Promise<boolean> => {
    const headers = getHeaders()

    try {
      // Token expired or missing - try refresh
      if (isTokenExpired(tokenExpiresAtCookie.value ?? undefined)) {
        await $fetch('/api/auth/refresh', { method: 'POST', headers })
        refreshTokenExpiry()
      }

      // Load profile if not already loaded
      if (!user.value) {
        user.value = await $fetch<AdminUserProfile>('/api/auth/profile', { headers })
      }

      return true
    } catch {
      user.value = null
      refreshTokenExpiry()
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated,
    tokenExpiresAt,
    ensureAuthenticated,
    login,
    logout
  }
}
