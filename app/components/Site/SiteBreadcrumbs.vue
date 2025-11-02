<script setup lang="ts">
type CrumbItem = {
  label: string
  url?: string
}

defineProps<{
  crumbs?: CrumbItem[]
}>()

const { getPage } = useDrupalCe()
const page = getPage()

const breadcrumbs = ref(
  crumbs && crumbs.length > 0 ? crumbs : page.value?.breadcrumbs || [],
)

const breadcrumbLinks = ref(
  breadcrumbs.value.map((crumb) => ({
    label: crumb.label,
    to: crumb.url || null,
  })),
)
</script>

<template>
  <UBreadcrumb v-if="breadcrumbLinks.length > 0" :items="breadcrumbLinks">
    <template #separator>
      <span class="mx-2 text-(--ui-text-muted)">/</span>
    </template>
  </UBreadcrumb>
</template>
