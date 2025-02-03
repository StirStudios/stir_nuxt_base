<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { fetchPage, renderCustomElements, usePageHead, getPageLayout } =
  await useDrupalCe()

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = getPageLayout(page)

const { isAdministrator, bodyClasses } = usePageContext(page)

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
  <DrupalTabs v-if="isAdministrator" :tabs="page.local_tasks" />
  <NavigationMain :site="page" />
  <main id="main-content" role="main">
    <SiteMessages />
    <slot
      :page="page"
      :layout="layout"
      :renderCustomElements="renderCustomElements"
    />
  </main>
  <LazyAppFooter :site="page" />
</template>
