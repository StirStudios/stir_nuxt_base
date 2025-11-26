<script lang="ts" setup>
const { fetchPage, renderCustomElements, usePageHead } = useDrupalCe()
const { bodyClasses } = usePageContext()
const theme = useAppConfig().stirTheme

const page = await fetchPage(
  useRoute().path,
  { query: useRoute().query },
  customPageError,
)
const layout = page.value.page_layout

usePageHead(page)

useHead({
  bodyAttrs: {
    class: bodyClasses,
  },
})

definePageMeta({
  key: (route) => route.fullPath.split('#')[0],
})

function customPageError(error: Record<string, any>) {
  const code = error?.value?.statusCode ?? 500
  const message = error?.value?.statusMessage ?? 'Page not found'
  throw createError({ statusCode: code, statusMessage: message })
}
</script>

<template>
  <NuxtLayout :name="layout">
    <LazySiteBreadcrumbs v-if="theme.crumbs" />
    <component :is="renderCustomElements(page.content)" v-if="page?.content" />
    <LazyRegionArea area="after_main" />
  </NuxtLayout>
</template>
