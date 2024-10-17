<script setup lang="ts">
import type { PageProps } from '~/types'

defineProps<PageProps>()
</script>

<template>
  <ParagraphLayout :section="section" />
</template>
