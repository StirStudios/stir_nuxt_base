<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead } = useDrupalCe()
const { bodyClasses } = usePageContext()
const theme = useAppConfig().stirTheme
const route = useRoute()

const page = await fetchPage(
  route.path,
  { query: route.query },
  customPageError,
)
const layout = page.value.page_layout

const hideHero = computed(() =>
  ['true', '1'].includes(String(page.value?.content?.hide ?? '').toLowerCase())
    ? true
    : undefined,
)

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

function customPageError(error: Record<string, any>) {
  const code = error?.value?.statusCode ?? 500
  const message = error?.value?.statusMessage ?? 'Page not found'

  throw createError({ statusCode: code, statusMessage: message })
}
</script>

<template>
  <NuxtLayout :name="layout">
    <ParagraphHero
      :hero="page?.content?.hero?.[0]"
      :hide="hideHero"
      :page-title="page.title"
      :site-slogan="page.site_info?.slogan || ''"
    />
    <LazyRegionArea area="before_main" />
    <LazySiteBreadcrumbs v-if="theme.crumbs" />
    <component :is="renderCustomElements(page.content)" v-if="page?.content" />
    <LazyRegionArea area="after_main" />
  </NuxtLayout>
</template>
