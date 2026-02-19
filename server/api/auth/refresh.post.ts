export default defineEventHandler(async (event): Promise<void> => {
  const authClient = useAuthClient(event)

  try {
    const response = await authClient.refreshToken()
    setAuthCookies(event, response)
  } catch {
    clearAuthCookies(event)
    throw createError({
      statusCode: 401,
      message: 'Failed to refresh token'
    })
  }
})
