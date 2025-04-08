<script setup lang="ts">
const { fetchPage, renderCustomElements, getPageLayout } = await useDrupalCe()
const { bodyClasses, isFront } = usePageContext()
const theme = useAppConfig().stirTheme

const route = useRoute()
const { data: page } = await useAsyncData(() =>
  fetchPage(route.path, { query: route.query }),
)
const layout = getPageLayout(page.value)

const jsonLd = JSON.stringify(page.value.metatags?.jsonld || [])

useHead({
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: bodyClasses },
  title: page.value?.title,
  meta: page.value?.metatags?.meta || [],
  link: page.value?.metatags?.link || [],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(page.value?.metatags?.jsonld || []),
    },
  ],
})
</script>

<template>
  <NuxtLayout :name="layout">
    <ParagraphHero
      v-if="page?.content?.hero?.length"
      :hero="page.content.hero[0]"
      :page-title="page.title"
      :site-slogan="page.site_info?.slogan || ''"
    />
    <h1 v-else :class="[isFront ? theme.front?.h1 : theme.h1, theme.container]">
      {{ page.title }}
    </h1>

    <LazySiteBreadcrumbs v-if="theme.crumbs" />
    <component v-if="page?.content" :is="renderCustomElements(page.content)" />
  </NuxtLayout>
</template>
