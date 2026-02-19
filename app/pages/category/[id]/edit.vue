<script setup lang="ts">
import type { CategoryAttributeFormData, CategoryFormData } from '~/schemas/category.schema'

const route = useRoute()
const toast = useToast()

const categoryId = computed(() => route.params.id as string)

// Fetch category and attributes
const [{ data: category, error: categoryError }, { data: attributesData }] = await Promise.all([
  useFetch(`/api/catalog/categories/${categoryId.value}`),
  useFetch('/api/catalog/attributes')
])

if (categoryError.value || !category.value) {
  throw createError({
    statusCode: 404,
    message: 'Category not found'
  })
}

const availableAttributes = computed(() => attributesData.value?.items || [])

// Convert category to form data
const initialData = computed(() => ({
  id: category.value!.id,
  version: category.value!.version,
  name: category.value!.name,
  enabled: category.value!.enabled,
  attributes: category.value!.attributes?.map((attr) => ({
    attributeId: attr.attributeId,
    role: attr.role as 'variant' | 'specification',
    required: attr.required,
    sortOrder: attr.sortOrder,
    filterable: attr.filterable,
    searchable: attr.searchable
  })) || []
}))

async function handleSubmit(data: CategoryFormData) {
  const { data: result, error } = await useFetch('/api/catalog/categories', {
    method: 'PUT',
    body: {
      id: data.id,
      version: data.version,
      name: data.name,
      enabled: data.enabled,
      attributes: data.attributes.map((attr: CategoryAttributeFormData) => ({
        attributeId: attr.attributeId,
        role: attr.role,
        required: attr.required,
        sortOrder: attr.sortOrder,
        filterable: attr.filterable,
        searchable: attr.searchable
      }))
    }
  })

  if (error.value || !result.value?.success) {
    const errData = (result.value as { error?: { title?: string; detail?: string } } | null)?.error
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to update category',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Category updated successfully',
    color: 'success'
  })

  await navigateTo('/category')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Category</h1>
      <p class="text-muted mt-1">Update category information</p>
    </div>

    <UCard>
      <CategoryForm
        :initial-data="initialData"
        :available-attributes="availableAttributes"
        is-edit-mode
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
