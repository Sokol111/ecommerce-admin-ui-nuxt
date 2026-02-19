<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AttributeResponse } from '@sokol111/ecommerce-catalog-service-api'

const route = useRoute()

// Query params
const page = computed(() => Number(route.query.page) || 1)
const size = computed(() => Number(route.query.size) || 10)

// Fetch attributes
const { data, pending, error } = await useFetch('/api/catalog/attributes', {
  query: {
    page,
    size
  }
})

// Table columns
const columns: TableColumn<AttributeResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'options', header: 'Options' },
  { accessorKey: 'enabled', header: 'Status' },
  { id: 'actions', header: '' }
]

// Actions menu items
function getRowActions(row: AttributeResponse) {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        click: () => navigateTo(`/attribute/${row.id}/edit`)
      }
    ]
  ]
}

// Pagination
const totalPages = computed(() => {
  if (!data.value) return 1
  return Math.ceil(data.value.total / size.value)
})

function handlePageChange(newPage: number) {
  navigateTo({
    query: {
      ...route.query,
      page: newPage
    }
  })
}

// Type labels
const typeLabels: Record<string, string> = {
  single: 'Single',
  multiple: 'Multiple',
  range: 'Range',
  boolean: 'Boolean',
  text: 'Text'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold">Attributes</h1>
        <UBadge v-if="data" color="neutral" variant="subtle">
          {{ data.total }}
        </UBadge>
      </div>
      <UButton to="/attribute/create" icon="i-lucide-plus">
        Create Attribute
      </UButton>
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-alert-circle"
      title="Error loading attributes"
      :description="error.message"
      class="mb-4"
    />

    <!-- Table -->
    <UCard>
      <UTable
        :columns="columns"
        :data="data?.items || []"
        :loading="pending"
      >
        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>

        <template #slug-cell="{ row }">
          <code class="text-sm bg-muted px-2 py-0.5 rounded">{{ row.original.slug }}</code>
        </template>

        <template #type-cell="{ row }">
          <UBadge color="info" variant="subtle">
            {{ typeLabels[row.original.type] || row.original.type }}
          </UBadge>
        </template>

        <template #options-cell="{ row }">
          <UBadge color="neutral" variant="subtle">
            {{ row.original.options?.length || 0 }}
          </UBadge>
        </template>

        <template #enabled-cell="{ row }">
          <UBadge :color="row.original.enabled ? 'success' : 'neutral'">
            {{ row.original.enabled ? 'Enabled' : 'Disabled' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getRowActions(row.original)">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-more-horizontal"
              size="sm"
            />
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Pagination -->
      <template v-if="totalPages > 1" #footer>
        <div class="flex justify-center">
          <UPagination
            :model-value="page"
            :total="data?.total || 0"
            :items-per-page="size"
            @update:model-value="handlePageChange"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
