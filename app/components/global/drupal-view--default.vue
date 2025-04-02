<script setup lang="ts">
const props = defineProps<{
  title: string
  rows?: object[]
  pager?: object
}>()

const { renderCustomElements } = useDrupalCe()
</script>

<template>
  <div class="view">
    <h1>{{ title }}</h1>
    <component
      :is="renderCustomElements(row)"
      v-for="(row, index) in rows"
      :key="index"
    />
    <DrupalPagination
      :current="pager.current"
      :total-pages="pager.totalPages"
    />
  </div>
</template>
