<script setup lang="ts">
import type { NodeLinkProps } from '~/types/BaseTypes'
const { page } = usePageContext()

const prevNode = page.value?.prev_node as NodeLinkProps | null
const nextNode = page.value?.next_node as NodeLinkProps | null
</script>

<template>
  <div class="container mb-5 flex justify-between">
    <UButton
      v-if="prevNode"
      icon="i-heroicons-chevron-left"
      size="xl"
      color="primary"
      square
      variant="link"
      label="Previous"
      :to="prevNode.url"
    />
    <UButton
      v-if="nextNode"
      icon="i-heroicons-chevron-right"
      size="xl"
      color="primary"
      square
      variant="link"
      label="Next"
      trailing
      :to="nextNode.url"
      class="ml-auto"
    />
  </div>
</template>
