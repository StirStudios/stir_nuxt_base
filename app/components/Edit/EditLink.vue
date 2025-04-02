<script setup lang="ts">
import type { EditLinkProps } from '~/types/LinkTypes'

defineProps<EditLinkProps>()
</script>

<template>
  <div v-if="link" class="group relative">
    <UButton
      class="absolute top-0 right-0 z-20 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      icon="i-heroicons-pencil-square"
      size="xs"
      :to="link"
    />
    <slot />
  </div>
  <slot v-else />
</template>
