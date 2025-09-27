<script setup lang="ts">
import type { ViewItemProps } from '~/types/CustomElementTypes'

defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <ParagraphMedia :item="item" />
</template>
