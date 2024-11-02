<script setup lang="ts">
import type { NodeLinkProps } from '@stir/base/types/BaseTypes'

defineProps<{
  prevNode?: NodeLinkProps | null
  nextNode?: NodeLinkProps | null
}>()
</script>

<template>
  <div class="flex justify-between">
    <UButton
      v-if="prevNode"
      icon="i-heroicons-chevron-left"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Previous"
      :to="prevNode.url"
    />
    <UButton
      v-if="nextNode"
      icon="i-heroicons-chevron-right"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Next"
      trailing
      :to="nextNode.url"
    />
  </div>
</template>
