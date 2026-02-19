export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Attribute ID is required'
    })
  }

  const catalogClient = useCatalogClient(event)

  try {
    const result = await catalogClient.getAttributeById(id)
    return result
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number, data?: { detail?: string } }
    }
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.detail || 'Failed to fetch attribute'
    })
  }
})
