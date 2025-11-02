<script setup lang="ts">
import type { PageProps } from '~/types'

// Prevents Vue from automatically binding unknown attributes to the root element.
// This avoids unexpected warnings when props like `hide` are passed but not explicitly used.
defineOptions({ inheritAttrs: false })

defineProps<PageProps>()
</script>

<template>
  <ParagraphLayout :section="section" />
</template>
