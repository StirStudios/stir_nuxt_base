<script setup lang="ts">
import type { PageProps } from '~/base/types'

defineProps<PageProps>()
</script>

<template>
  <ParagraphLayout :section="section" />
</template>
