<script setup lang="ts">
import type { EditLinkProps } from '~/types/LinkTypes'

defineProps<EditLinkProps>()
</script>

<template>
  <UButton
    class="absolute top-0 right-0 z-20 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    icon="i-heroicons-pencil-square"
    v-if="link"
    :to="link"
    size="xs"
  />
</template>
