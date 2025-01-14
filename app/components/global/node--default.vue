<script setup lang="ts">
import type { PageProps } from '~/types/BaseTypes'

defineProps<PageProps>()
</script>

<template>
  <ParagraphLayout :section="section" />
</template>
