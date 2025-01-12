<script setup lang="ts">
import type { PageProps } from '@stir/base/types/BaseTypes'

defineProps<PageProps>()
</script>

<template>
  <ParagraphLayout :section="section" />
</template>
