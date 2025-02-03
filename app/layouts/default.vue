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
  <main
    id="main-content"
    role="main"
    :class="[
      isAdministrator && page.content.hero && page.content.hero.length === 0
        ? 'pt-[23.9rem]' // Combined padding for both cases (3.9rem + 20rem)
        : isAdministrator
          ? 'pt-[3.9rem]' // Admin only
          : page.content.hero && page.content.hero.length === 0
            ? 'pt-[20rem]' // Empty hero only
            : '',
    ]"
  >
    <SiteMessages />
    <slot
      :page="page"
      :layout="layout"
      :renderCustomElements="renderCustomElements"
    />
  </main>
  <LazyAppFooter :site="page" />
</template>
