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
  <header aria-label="Site header">
    <DrupalTabs
      v-if="isAdministrator"
      :user="page.current_user"
      :tabs="page.local_tasks"
    />
    <NavigationMain :site="page" />
  </header>
  <main
    id="main-content"
    role="main"
    :class="[
      isAdministrator ? 'pt-[3.9rem]' : '',
      !page.content.hero ? 'pt-[10rem]' : '',
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
