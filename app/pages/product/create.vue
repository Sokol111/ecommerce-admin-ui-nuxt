<script setup lang="ts">
import type { ProductFormData } from '~/schemas/product.schema'

const toast = useToast()

// Fetch categories for the form
const { data: categoriesData } = await useFetch('/api/catalog/categories')

const categories = computed(() => categoriesData.value?.items || [])

async function handleSubmit(data: ProductFormData) {
  const { data: result, error } = await useFetch('/api/catalog/products', {
    method: 'POST',
    body: {
      id: data.id,
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
    const errData = (result.value as { error?: { title?: string; detail?: string } } | null)?.error
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to create product',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Product created successfully',
    color: 'success'
  })

  await navigateTo('/product')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Create Product</h1>
      <p class="text-muted mt-1">Add a new product to your catalog</p>
    </div>

    <UCard>
      <ProductForm
        :categories="categories"
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
