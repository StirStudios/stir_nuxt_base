<script setup lang="ts">
const { getPage } = useDrupalCe()
const page = getPage()

// Ensure breadcrumbs are reactive and fallback to page data
const breadcrumbs = computed(() => page.value?.breadcrumbs || [])

// Map breadcrumbs to UBreadcrumb items format
const breadcrumbLinks = computed(() =>
  breadcrumbs.value.map((crumb) => ({
    label: crumb.label,
    to: crumb.url || null,
  })),
)
</script>

<template>
  <UBreadcrumb :items="breadcrumbLinks" v-if="breadcrumbLinks.length > 0">
    <template #separator>
      <span class="mx-2 text-(--ui-text-muted)">/</span>
    </template>
  </UBreadcrumb>
</template>
