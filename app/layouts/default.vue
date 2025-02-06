<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { fetchPage, renderCustomElements, getPageLayout } = useDrupalCe()

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = getPageLayout(page)

const { isAdministrator, bodyClasses } = usePageContext(page)

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
  <DrupalTabs v-if="isAdministrator" :tabs="page.local_tasks" />
  <NavigationMain :site="page" />
  <main
    id="main-content"
    role="main"
    :class="
      page.content?.hero && page.content.hero.length > 0 ? '' : 'pt-[10rem]'
    "
  >
    <slot
      :page="page"
      :layout="layout"
      :renderCustomElements="renderCustomElements"
    />
  </main>
  <LazySiteMessages />
  <LazyAppFooter :site="page" />
</template>
