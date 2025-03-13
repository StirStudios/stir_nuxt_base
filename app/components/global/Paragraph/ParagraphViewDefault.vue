<script setup lang="ts">
const { isAdministrator } = usePageContext()
defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <component
    v-for="node in item.section"
    :is="resolveComponent(node.element)"
    :key="node.uuid"
    :item="node"
  />

  <USlideover
    v-if="isAdministrator"
    title="API Data"
    close-icon="i-lucide-arrow-right"
  >
    <UButton class="mt-5" label="Data" size="sm" color="primary" />
    <template #content>
      <pre class="overflow-x-auto p-10 text-xs">{{ item }}</pre>
    </template>
  </USlideover>
</template>
