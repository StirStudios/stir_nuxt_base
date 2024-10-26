<script setup lang="ts">
import type { TextProps } from '~/types'

defineProps<TextProps>()
</script>

<template>
  <div
    :class="content.element === 'node' ? '' : 'p-10 text-center'"
    v-html="content"
  />
</template>
