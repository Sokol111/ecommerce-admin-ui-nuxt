import type { AdminUserProfile } from '@sokol111/ecommerce-auth-service-api'

export default defineEventHandler(async (event): Promise<AdminUserProfile> => {
  const authClient = useAuthClient(event)

  try {
    return await authClient.getProfile()
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Failed to get profile'
    })
  }
})
