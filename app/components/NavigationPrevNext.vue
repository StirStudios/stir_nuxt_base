<script setup lang="ts">
const { page } = usePageContext()

type NodeLink = {
  nid: string
  title: string
  url: string
}

const prevNode = page.value?.prev_node as NodeLink | null
const nextNode = page.value?.next_node as NodeLink | null
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
