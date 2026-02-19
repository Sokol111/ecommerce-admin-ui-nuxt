<script setup lang="ts">
import type { AttributeFormData, AttributeOptionFormData } from '~/schemas/attribute.schema'

const toast = useToast()

async function handleSubmit(data: AttributeFormData) {
  const { data: result, error } = await useFetch('/api/catalog/attributes', {
    method: 'POST',
    body: {
      id: data.id,
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
    const errData = 'error' in result.value! ? result.value.error : undefined
    toast.add({
      title: errData?.title || 'Error',
      description: errData?.detail || 'Failed to create attribute',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Success',
    description: 'Attribute created successfully',
    color: 'success'
  })

  await navigateTo('/attribute')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Create Attribute</h1>
      <p class="text-muted mt-1">Add a new attribute to your catalog</p>
    </div>

    <UCard>
      <AttributeForm @submit="handleSubmit" />
    </UCard>
  </div>
</template>
