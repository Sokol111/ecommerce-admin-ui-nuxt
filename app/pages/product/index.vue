<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ProductResponse } from '@sokol111/ecommerce-catalog-service-api'

const route = useRoute()

// Query params
const page = computed(() => Number(route.query.page) || 1)
const size = computed(() => Number(route.query.size) || 10)

// Fetch products
const { data, pending, error, refresh } = await useFetch('/api/catalog/products', {
  query: {
    page,
    size
  }
})

// Table columns
const columns: TableColumn<ProductResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'enabled', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created At' },
  { id: 'actions', header: '' }
]

// Actions menu items
function getRowActions(row: ProductResponse) {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        click: () => navigateTo(`/product/${row.id}/edit`)
      }
    ]
  ]
}

// Format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
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
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold">Products</h1>
        <UBadge v-if="data" color="neutral" variant="subtle">
          {{ data.total }}
        </UBadge>
      </div>
      <UButton to="/product/create" icon="i-lucide-plus">
        Create Product
      </UButton>
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-alert-circle"
      title="Error loading products"
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

        <template #price-cell="{ row }">
          ${{ row.original.price.toFixed(2) }}
        </template>

        <template #quantity-cell="{ row }">
          <UBadge color="neutral" variant="subtle">
            {{ row.original.quantity }}
          </UBadge>
        </template>

        <template #enabled-cell="{ row }">
          <UBadge :color="row.original.enabled ? 'success' : 'neutral'">
            {{ row.original.enabled ? 'Enabled' : 'Disabled' }}
          </UBadge>
        </template>

        <template #createdAt-cell="{ row }">
          <div class="text-sm">
            <div>{{ formatDate(row.original.createdAt).date }}</div>
            <div class="text-muted">{{ formatDate(row.original.createdAt).time }}</div>
          </div>
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
