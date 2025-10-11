<script setup lang="ts">
type ParagraphBlockItem = {
  element?: string
  [key: string]: unknown
}

type BlocksProp = Record<
  string,
  Record<string, { paragraphBlock?: ParagraphBlockItem[] }>
>

const props = withDefaults(
  defineProps<{
    blockName: string
    blocks: BlocksProp
    region?: string
  }>(),
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
