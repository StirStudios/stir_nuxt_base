<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead, getPageLayout } =
  useDrupalCe()
const { bodyClasses, isFront } = usePageContext()
const theme = useAppConfig().stirTheme

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = getPageLayout(page.value)
usePageHead(page)

definePageMeta({
  key: (route) => {
    const params = new URLSearchParams(
      route.query as Record<string, any>,
    ).toString()
    return params ? `${route.path}?${params}` : route.path
  },
})
</script>

<template>
  <NuxtLayout :name="layout">
    <ParagraphHero
      :hero="page?.content?.hero?.[0]"
      :page-title="page.title"
      :site-slogan="page.site_info?.slogan || ''"
      :hide="page?.content?.hide || ''"
    />

    <LazySiteBreadcrumbs v-if="theme.crumbs" />
    <component :is="renderCustomElements(page.content)" v-if="page?.content" />
  </NuxtLayout>
</template>
