<script setup lang="ts">
const { renderCustomElements } = useDrupalCe()
const { page } = usePageContext()
const props = defineProps<{ area: string }>()
const regionBlocks = computed(() => page.value?.blocks?.[props.area] ?? {})
</script>

<template>
  <template v-for="(block, name) in regionBlocks" :key="block.uuid || name">
    <component :is="renderCustomElements(block)" v-if="block" />
  </template>
</template>
