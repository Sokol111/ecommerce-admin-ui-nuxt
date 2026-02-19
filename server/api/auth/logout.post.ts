export default defineEventHandler(async (event): Promise<void> => {
  const authClient = useAuthClient(event)

  try {
    await authClient.logout()
  } catch {
    // Ignore errors - clear cookies anyway
  }

  clearAuthCookies(event)
})
