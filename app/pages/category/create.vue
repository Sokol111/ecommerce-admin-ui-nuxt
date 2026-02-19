<script setup lang="ts">
import type { CategoryFormData, CategoryAttributeFormData } from '~/schemas/category.schema'

const toast = useToast()

// Fetch attributes for the form
const { data: attributesData } = await useFetch('/api/catalog/attributes')

const availableAttributes = computed(() => attributesData.value?.items || [])

async function handleSubmit(data: CategoryFormData) {
  const { data: result, error } = await useFetch('/api/catalog/categories', {
    method: 'POST',
    body: {
      id: data.id,
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
    const errData = result.value?.error
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to create category',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Category created successfully',
    color: 'success'
  })

  await navigateTo('/category')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Create Category</h1>
      <p class="text-muted mt-1">Add a new category to your catalog</p>
    </div>

    <UCard>
      <CategoryForm
        :available-attributes="availableAttributes"
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
