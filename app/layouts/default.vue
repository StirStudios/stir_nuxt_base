<script setup lang="ts">
const { fetchPage, renderCustomElements, usePageHead, getPageLayout } =
  await useDrupalCe()

const page = await fetchPage(useRoute().path, { query: useRoute().query })
const layout = getPageLayout(page)

const { isAdministrator, classes } = await usePageContext()

usePageHead(page)

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: classes,
  },
})
</script>

<template>
  <DrupalTabs v-if="isAdministrator" :tabs="page.local_tasks" />
  <NavigationMain :site="page" />
  <SiteMessages />
  <main id="main-content" role="main">
    <slot
      :page="page"
      :layout="layout"
      :renderCustomElements="renderCustomElements"
    />
  </main>
  <LazyAppFooter :site="page" />
</template>
