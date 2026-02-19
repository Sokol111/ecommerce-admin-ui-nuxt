<script setup lang="ts">
import type { ProductFormData } from '~/schemas/product.schema'

const route = useRoute()
const toast = useToast()

const productId = computed(() => route.params.id as string)

// Fetch product and categories
const [{ data: product, error: productError }, { data: categoriesData }] = await Promise.all([
  useFetch(`/api/catalog/products/${productId.value}`),
  useFetch('/api/catalog/categories')
])

if (productError.value || !product.value) {
  throw createError({
    statusCode: 404,
    message: 'Product not found'
  })
}

const categories = computed(() => categoriesData.value?.items || [])

// Convert product to form data
const initialData = computed(() => ({
  id: product.value!.id,
  version: product.value!.version,
  imageId: product.value!.imageId,
  categoryId: product.value!.categoryId,
  name: product.value!.name,
  description: product.value!.description,
  price: product.value!.price,
  quantity: product.value!.quantity,
  enabled: product.value!.enabled,
  attributes: product.value!.attributes?.map((attr) => ({
    attributeId: attr.attributeId,
    optionSlugValue: attr.optionSlugValue,
    optionSlugValues: attr.optionSlugValues,
    numericValue: attr.numericValue,
    textValue: attr.textValue,
    booleanValue: attr.booleanValue
  })) || []
}))

async function handleSubmit(data: ProductFormData) {
  const { data: result, error } = await useFetch('/api/catalog/products', {
    method: 'PUT',
    body: {
      id: data.id,
      version: data.version,
      name: data.name,
      description: data.description || undefined,
      price: data.price,
      quantity: data.quantity,
      enabled: data.enabled,
      imageId: data.imageId || undefined,
      categoryId: data.categoryId || undefined,
      attributes: data.attributes?.filter(
        (attr) =>
          attr.optionSlugValue !== undefined ||
          (attr.optionSlugValues && attr.optionSlugValues.length > 0) ||
          attr.numericValue !== undefined ||
          attr.textValue !== undefined ||
          attr.booleanValue !== undefined
      )
    }
  })

  if (error.value || !result.value?.success) {
    const errData = result.value?.error
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to update product',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Product updated successfully',
    color: 'success'
  })

  await navigateTo('/product')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Product</h1>
      <p class="text-muted mt-1">Update product information</p>
    </div>

    <UCard>
      <ProductForm
        :initial-data="initialData"
        :categories="categories"
        is-edit-mode
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
