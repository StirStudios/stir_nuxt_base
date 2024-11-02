<script setup lang="ts">
import { PageProps } from '~/types/PageTypes'

const page = ref<PageProps>
</script>

<template>
  <template v-if="page.prevNext">
    <UButton
      v-if="page.prevNext.prev_node"
      icon="i-heroicons-pencil-square"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Previous"
      :to="page.prevNext.prev_node.url"
    />
    <UButton
      v-if="page.prevNext.next_node"
      icon="i-heroicons-pencil-square"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Next"
      :to="page.prevNext.next_node.url"
    />
  </template>
</template>
