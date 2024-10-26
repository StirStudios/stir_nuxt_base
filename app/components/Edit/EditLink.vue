<script setup>
import type { EditLinkProps } from '~/types'

defineProps<EditLinkProps>()
</script>

<template>
  <UButton
    class="absolute right-0 top-0 z-50 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    icon="i-heroicons-pencil-square"
    v-if="link"
    :to="link"
    size="xs"
  />
</template>
