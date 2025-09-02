<script setup lang="ts">
import type { ParagraphBlockProps } from '~/types/ContentTypes'

const props = withDefaults(
  defineProps<ParagraphBlockProps & { region?: string }>(),
  { region: 'decoupled' },
)

const blockData = computed(
  () =>
    props.blocks?.[props.region]?.[props.blockName]?.paragraphBlock?.[0] ??
    null,
)

const section = computed(() =>
  blockData.value?.element === 'paragraph-layout' ? [blockData.value] : [],
)
</script>

<template>
  <ParagraphLayout v-if="section.length" :section="section" />
</template>
