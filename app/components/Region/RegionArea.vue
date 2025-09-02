<script setup lang="ts">
const props = defineProps<{ area: string }>()
const { page } = usePageContext()

const regionBlocks = computed(() => page.value?.blocks?.[props.area] ?? {})
const names = computed(() => Object.keys(regionBlocks.value))
</script>

<template>
  <ParagraphBlock
    v-for="name in names"
    :key="name"
    :block-name="name"
    :blocks="{ [area]: regionBlocks }"
    :region="area"
  />
</template>
