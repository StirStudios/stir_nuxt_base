<script setup lang="ts">
import { componentExists } from '~/utils/componentExists'
const { isAdministrator } = usePageContext()
defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <template v-for="node in item.section" :key="node.uuid">
    <template v-if="componentExists(node.element)">
      <component :is="resolveComponent(node.element)" :item="node" />
    </template>
    <UAlert
      v-else
      color="error"
      variant="subtle"
      icon="i-lucide-terminal"
      title="Missing component"
      :description="`The component '${node.element}' does not exist. Using default fallback.`"
    />
  </template>
</template>
