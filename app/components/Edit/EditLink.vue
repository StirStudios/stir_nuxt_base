<script setup lang="ts">
import type { EditLinkProps } from '~/types/LinkTypes'

defineProps<EditLinkProps>()
</script>

<template>
  <div v-if="link" class="group/edit relative">
    <UButton
      aria-label="Edit content"
      class="absolute top-0 right-0 z-20 rounded opacity-0 transition-opacity duration-300 group-hover/edit:opacity-100"
      icon="i-heroicons-pencil-square"
      size="xs"
      title="Edit content"
      :to="link"
    >
      <span class="sr-only">Edit content</span>
    </UButton>
    <slot />
  </div>
  <slot v-else />
</template>
