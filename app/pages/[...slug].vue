<script lang="ts" setup>
const { fetchPage, renderCustomElements, usePageHead, usePageLayout } =
  useDrupalCe()

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = usePageLayout

usePageHead(page)

definePageMeta({
  key: (route) => route.fullPath.split('#')[0],
})
</script>

<template>
  <NuxtLayout :name="layout">
    <component :is="renderCustomElements(page.content)" v-if="page?.content" />
  </NuxtLayout>
</template>
