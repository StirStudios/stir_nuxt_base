<script setup lang="ts">
import type { CrumbProps } from '~/types/NavigationTypes'

const props = defineProps<CrumbProps>()

const { getPage } = useDrupalCe()
const page = getPage()

const breadcrumbs = ref(
  props.crumb && props.crumb.length > 0
    ? props.crumb
    : page.value?.breadcrumbs || [],
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
