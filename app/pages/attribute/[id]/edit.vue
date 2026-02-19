<script setup lang="ts">
import type { AttributeFormData, AttributeOptionFormData } from '~/schemas/attribute.schema'

const route = useRoute()
const toast = useToast()

const attributeId = computed(() => route.params.id as string)

// Fetch attribute
const { data: attribute, error: attributeError } = await useFetch(
  `/api/catalog/attributes/${attributeId.value}`
)

if (attributeError.value || !attribute.value) {
  throw createError({
    statusCode: 404,
    message: 'Attribute not found'
  })
}

// Convert attribute to form data
const initialData = computed(() => ({
  id: attribute.value!.id,
  version: attribute.value!.version,
  name: attribute.value!.name,
  slug: attribute.value!.slug,
  type: attribute.value!.type as 'single' | 'multiple' | 'range' | 'boolean' | 'text',
  unit: attribute.value!.unit,
  enabled: attribute.value!.enabled,
  options: attribute.value!.options?.map((opt) => ({
    name: opt.name,
    slug: opt.slug,
    colorCode: opt.colorCode,
    sortOrder: opt.sortOrder
  })) || []
}))

async function handleSubmit(data: AttributeFormData) {
  const { data: result, error } = await useFetch('/api/catalog/attributes', {
    method: 'PUT',
    body: {
      id: data.id,
      version: data.version,
      name: data.name,
      slug: data.slug,
      type: data.type,
      unit: data.unit || undefined,
      enabled: data.enabled,
      options: data.options?.map((opt: AttributeOptionFormData) => ({
        name: opt.name,
        slug: opt.slug,
        colorCode: opt.colorCode || undefined,
        sortOrder: opt.sortOrder
      }))
    }
  })

  if (error.value || !result.value?.success) {
    const errData = result.value?.error
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to update attribute',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Attribute updated successfully',
    color: 'success'
  })

  await navigateTo('/attribute')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Attribute</h1>
      <p class="text-muted mt-1">Update attribute information</p>
    </div>

    <UCard>
      <AttributeForm
        :initial-data="initialData"
        is-edit-mode
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
