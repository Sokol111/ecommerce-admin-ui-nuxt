import type {
  ConfirmRequest,
  GetDeliveryUrl200,
  Image,
  PresignRequest,
  PresignResponse,
  PromoteImages200,
  PromoteRequest
} from '@sokol111/ecommerce-image-service-api'
import { getImageServiceAPI } from '@sokol111/ecommerce-image-service-api'
import type { H3Event } from 'h3'

const api = getImageServiceAPI()

export function useImageClient(event: H3Event) {
  const { imageApiUrl: baseURL } = useRuntimeConfig()
  const accessToken = getCookie(event, ACCESS_TOKEN_KEY)

  function getHeaders() {
    if (!accessToken) {
      throw createError({ statusCode: 401, message: 'Not authenticated' })
    }
    return { Authorization: `Bearer ${accessToken}` }
  }

  return {
    async createPresign(request: PresignRequest): Promise<PresignResponse> {
      const response = await api.createPresign(request, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async confirmUpload(request: ConfirmRequest): Promise<Image> {
      const response = await api.confirmUpload(request, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async promoteImages(request: PromoteRequest): Promise<PromoteImages200> {
      const response = await api.promoteImages(request, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async getDeliveryUrl(params: {
      imageId: string
      options: { w: number, quality: number }
    }): Promise<GetDeliveryUrl200> {
      const response = await api.getDeliveryUrl(
        params.imageId,
        { w: params.options.w, quality: params.options.quality },
        { baseURL, headers: getHeaders() }
      )
      return response.data
    }
  }
}

export type ImageClient = ReturnType<typeof useImageClient>
