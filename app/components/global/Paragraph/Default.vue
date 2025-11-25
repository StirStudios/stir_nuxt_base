<script setup lang="ts">
const isDev = import.meta.dev

const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  editLink?: string
}>()
</script>

<template>
  <UAlert
    v-if="isDev"
    class="m-auto mb-20 max-w-lg space-y-2"
    color="error"
    title="Missing Paragraph Component"
    variant="subtle"
  >
    <template #description>
      <p class="mb-5">This paragraph does not have a mapped Vue component.</p>
      <pre>{{ props }}</pre>
    </template>
  </UAlert>
</template>
