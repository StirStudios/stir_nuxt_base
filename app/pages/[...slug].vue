<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead, getPageLayout } =
  await useDrupalCe()
const { bodyClasses } = usePageContext()
const appConfig = useAppConfig()

const route = useRoute()
const page = await fetchPage(route.path, { query: route.query })

const layout = getPageLayout(page)

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: bodyClasses,
  },
  title: page.value.title,
  meta: page.value.metatags.meta,
  link: page.value.metatags.link,
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(page.value.metatags.jsonld || []),
    },
  ],
})
</script>

<template>
  <NuxtLayout :name="layout">
    <ParagraphHero
      v-if="page.content.hero && page.content.hero.length > 0"
      :hero="page.content.hero[0]"
      :page-title="page.title"
      :site-slogan="page.site_info.slogan"
    />
    <h1 v-else :class="[appConfig.stirTheme.h1, appConfig.stirTheme.container]">
      {{ page.title }}
    </h1>
    <LazySiteBreadcrumbs v-if="appConfig.stirTheme.crumbs" />
    <component :is="renderCustomElements(page.content)" />
  </NuxtLayout>
</template>
