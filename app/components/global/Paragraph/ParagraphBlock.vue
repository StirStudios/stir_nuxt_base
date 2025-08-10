<script setup lang="ts">
import type { ParagraphBlockProps } from '~/types/ContentTypes'

const props = defineProps<ParagraphBlockProps>()

// Extract block data safely
const blockData = computed(
  () => props.blocks?.decoupled?.[props.blockName]?.paragraphBlock?.[0] ?? null,
)

const isLayout = computed(() => blockData.value?.element === 'paragraph-layout')
</script>

<template>
  <ParagraphLayout v-if="blockData && isLayout" :section="[blockData]" />
</template>
