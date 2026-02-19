import { TOKEN_EXPIRY_BUFFER_MS } from '~/utils/auth/constants'

export default defineNuxtPlugin(() => {
  const { isAuthenticated, tokenExpiresAt, ensureAuthenticated } = useAuth()

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const scheduleRefresh = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (!isAuthenticated.value || !tokenExpiresAt.value) {
      return
    }

    const refreshAt = Math.max(0, tokenExpiresAt.value - TOKEN_EXPIRY_BUFFER_MS - Date.now())

    timeoutId = setTimeout(() => {
      ensureAuthenticated()
    }, refreshAt)
  }

  watch(
    [isAuthenticated, tokenExpiresAt],
    () => scheduleRefresh(),
    { immediate: true }
  )
})
