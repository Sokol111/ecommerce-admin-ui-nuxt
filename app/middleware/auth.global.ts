export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) return

  const { ensureAuthenticated } = useAuth()
  const isAuthenticated = await ensureAuthenticated()

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})
