<script setup lang="ts">
import { useDrupalApi } from '../composables/useDrupalApi'
const { isAdministrator, renderCustomElements, classes, page } =
  await useDrupalApi()

definePageMeta({
  layout: false,
})

const layout = computed(() => {
  return page.value.page_layout || 'default'
})

useHead({
  title: page.value.metatags.meta[0]?.content,
  meta: page.value.metatags.meta,
  link: page.value.metatags.link,
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: classes,
  },
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(page.value.metatags.jsonld || [], null, ''),
    },
  ],
})
</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <ClientOnly v-if="isAdministrator">
        <Teleport to="#admin-menu">
          <DrupalTabs :tabs="page.local_tasks" />
        </Teleport>
      </ClientOnly>
      <component :is="renderCustomElements(page.content)" />
    </NuxtLayout>
  </div>
</template>
