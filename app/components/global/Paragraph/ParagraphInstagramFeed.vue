<script setup lang="ts">
import type { ViewItemProps } from '~/types/CustomElementTypes'
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <ParagraphMedia :item="item" />
</template>
