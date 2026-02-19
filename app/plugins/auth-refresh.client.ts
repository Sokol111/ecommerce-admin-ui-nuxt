// Auto-refresh token every 4 minutes (assuming token lives ~5 min)
const REFRESH_INTERVAL_MS = 4 * 60 * 1000

export default defineNuxtPlugin(() => {
  const { isAuthenticated, refreshSession } = useAuth()

  setInterval(async () => {
    if (isAuthenticated.value) {
      await refreshSession()
    }
  }, REFRESH_INTERVAL_MS)
})
