<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'

defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <ParagraphMedia :item="item" />
</template>
