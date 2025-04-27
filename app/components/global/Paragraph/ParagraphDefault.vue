<script setup lang="ts">
import { componentExists, resolveComponentName } from '~/utils/componentExists'
defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <template v-for="node in item.section" :key="node.uuid">
    <template v-if="componentExists(node.element)">
      <component :is="resolveComponentName(node.element)" :item="node" />
    </template>
    <UAlert
      v-else
      color="error"
      :description="`The component '${node.element}' does not exist. Using default fallback.`"
      icon="i-lucide-terminal"
      title="Missing component"
      variant="subtle"
    />
  </template>
</template>
