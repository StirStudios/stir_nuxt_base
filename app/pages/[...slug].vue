<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead, getPageLayout } =
  await useDrupalCe()
const { isAdministrator, bodyClasses } = usePageContext()
const appConfig = useAppConfig()

const page = await fetchPage(useRoute().path, { query: useRoute().query })

const layout = getPageLayout(page)

usePageHead(page)

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: bodyClasses,
  },
})
</script>

<template>
  <NuxtLayout :name="layout">
    <h1 :class="appConfig.stirTheme.h1">{{ page.title }}</h1>
    <LazySiteBreadcrumbs v-if="appConfig.stirTheme.crumbs" />
    <component :is="renderCustomElements(page.content)" />
  </NuxtLayout>
</template>
