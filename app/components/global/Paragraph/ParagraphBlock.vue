<script setup lang="ts">
import { componentExists } from '~/utils/componentExists'

defineProps<{
  blockName: string // Pass the block name (e.g., "gin_test")
  blocks: Record<string, any> // The blocks object from the API response
}>()

// Get the block data safely
const blockData = computed(() => {
  return blocks?.decoupled?.[blockName]?.paragraphBlock?.[0] || null
})

// Get the element name dynamically
const resolvedComponent = computed(() => {
  const element = blockData.value?.content?.element || ''
  return componentExists(element) ? element : 'ParagraphDefault'
})

// Extract the item to bind
const itemData = computed(() => {
  return blockData.value?.content?.rows?.[0] || []
})
</script>

<template>
  <component
    v-if="blockData"
    :is="resolvedComponent"
    v-bind="{ item: itemData }"
  />
  <p v-else class="text-center text-gray-500">No content available.</p>
</template>
