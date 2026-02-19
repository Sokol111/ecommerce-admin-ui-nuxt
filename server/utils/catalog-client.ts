import type {
  AttributeListResponse,
  AttributeResponse,
  CategoryListResponse,
  CategoryResponse,
  CreateAttributeRequest,
  CreateCategoryRequest,
  CreateProductRequest,
  GetAttributeListParams,
  GetCategoryListParams,
  GetProductListParams,
  ProductListResponse,
  ProductResponse,
  UpdateAttributeRequest,
  UpdateCategoryRequest,
  UpdateProductRequest
} from '@sokol111/ecommerce-catalog-service-api'
import { getCatalogAPI } from '@sokol111/ecommerce-catalog-service-api'
import type { H3Event } from 'h3'

const api = getCatalogAPI()

export function useCatalogClient(event: H3Event) {
  const { catalogApiUrl: baseURL } = useRuntimeConfig()
  const accessToken = getCookie(event, ACCESS_TOKEN_KEY)

  function getHeaders() {
    if (!accessToken) {
      throw createError({ statusCode: 401, message: 'Not authenticated' })
    }
    return { Authorization: `Bearer ${accessToken}` }
  }

  return {
    // ==================== PRODUCTS ====================

    async getProductById(productId: string): Promise<ProductResponse> {
      const response = await api.getProductById(productId, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async getProductList(
      params?: Partial<GetProductListParams>
    ): Promise<ProductListResponse> {
      const response = await api.getProductList(
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
          sort: params?.sort,
          order: params?.order,
          enabled: params?.enabled,
          categoryId: params?.categoryId
        },
        { baseURL, headers: getHeaders() }
      )
      return response.data
    },

    async createProduct(
      newProduct: CreateProductRequest
    ): Promise<ProductResponse> {
      const response = await api.createProduct(newProduct, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async updateProduct(
      updatedProduct: UpdateProductRequest
    ): Promise<ProductResponse> {
      const response = await api.updateProduct(updatedProduct, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    // ==================== CATEGORIES ====================

    async getCategoryById(categoryId: string): Promise<CategoryResponse> {
      const response = await api.getCategoryById(categoryId, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async getCategoryList(
      params?: Partial<GetCategoryListParams>
    ): Promise<CategoryListResponse> {
      const response = await api.getCategoryList(
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
          sort: params?.sort,
          order: params?.order,
          enabled: params?.enabled
        },
        { baseURL, headers: getHeaders() }
      )
      return response.data
    },

    async createCategory(
      newCategory: CreateCategoryRequest
    ): Promise<CategoryResponse> {
      const response = await api.createCategory(newCategory, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async updateCategory(
      updatedCategory: UpdateCategoryRequest
    ): Promise<CategoryResponse> {
      const response = await api.updateCategory(updatedCategory, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    // ==================== ATTRIBUTES ====================

    async getAttributeById(attributeId: string): Promise<AttributeResponse> {
      const response = await api.getAttributeById(attributeId, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async getAttributeList(
      params?: Partial<GetAttributeListParams>
    ): Promise<AttributeListResponse> {
      const response = await api.getAttributeList(
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
          sort: params?.sort,
          order: params?.order,
          enabled: params?.enabled
        },
        { baseURL, headers: getHeaders() }
      )
      return response.data
    },

    async createAttribute(
      newAttribute: CreateAttributeRequest
    ): Promise<AttributeResponse> {
      const response = await api.createAttribute(newAttribute, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    },

    async updateAttribute(
      updatedAttribute: UpdateAttributeRequest
    ): Promise<AttributeResponse> {
      const response = await api.updateAttribute(updatedAttribute, {
        baseURL,
        headers: getHeaders()
      })
      return response.data
    }
  }
}

export type CatalogClient = ReturnType<typeof useCatalogClient>
