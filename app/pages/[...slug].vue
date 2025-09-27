<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead } = useDrupalCe()
const { bodyClasses } = usePageContext()
const theme = useAppConfig().stirTheme

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = page.value.page_layout
usePageHead(page)

useHead({
  bodyAttrs: {
    class: bodyClasses,
  },
})

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
      :hide="page?.content?.hide || ''"
      :page-title="page.title"
      :site-slogan="page.site_info?.slogan || ''"
    />
    <LazyRegionArea area="before_main" />
    <LazySiteBreadcrumbs v-if="theme.crumbs" />
    <component :is="renderCustomElements(page.content)" v-if="page?.content" />
    <LazyRegionArea area="after_main" />
  </NuxtLayout>
</template>
