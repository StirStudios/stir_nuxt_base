<script setup lang="ts">
import { PageProps } from '~/types/PageTypes'

const page = ref<PageProps>()
</script>

<template>
  <template v-if="page">
    <UButton
      v-if="page.prev_node"
      icon="i-heroicons-pencil-square"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Previous"
      :to="page.prev_node.url"
    />
    <UButton
      v-if="page.next_node"
      icon="i-heroicons-pencil-square"
      size="sm"
      color="primary"
      square
      variant="solid"
      label="Next"
      :to="page.next_node.url"
    />
  </template>
</template>
