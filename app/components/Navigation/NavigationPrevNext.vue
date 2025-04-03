<script setup lang="ts">
import type { NodeLinkProps } from '~/types/BaseTypes'
const { page } = usePageContext()

const prevNode = page.value?.prev_node as NodeLinkProps | null
const nextNode = page.value?.next_node as NodeLinkProps | null
</script>

<template>
  <div class="container m-auto mb-5 flex justify-between">
    <UButton
      v-if="prevNode"
      color="primary"
      icon="i-heroicons-chevron-left"
      label="Previous"
      size="xl"
      square
      :to="prevNode.url"
      variant="link"
    />
    <UButton
      v-if="nextNode"
      class="ml-auto"
      color="primary"
      icon="i-heroicons-chevron-right"
      label="Next"
      size="xl"
      square
      :to="nextNode.url"
      trailing
      variant="link"
    />
  </div>
</template>
