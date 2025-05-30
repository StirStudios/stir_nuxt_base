<script setup lang="ts">
const { fetchPage, renderCustomElements, getPageLayout } = await useDrupalCe()
const { bodyClasses, isFront } = usePageContext()
const theme = useAppConfig().stirTheme

const route = useRoute()
const page = await fetchPage(route.path, { query: route.query })

const layout = getPageLayout(page.value)

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
  <div class="transition">
    <NuxtLayout :name="layout">
      <ParagraphHero
        :hero="page?.content?.hero?.[0]"
        :page-title="page.title"
        :site-slogan="page.site_info?.slogan || ''"
      />

      <LazySiteBreadcrumbs v-if="theme.crumbs" />
      <component
        :is="renderCustomElements(page.content)"
        v-if="page?.content"
      />
    </NuxtLayout>
  </div>
</template>
