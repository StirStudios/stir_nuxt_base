<script lang="ts" setup>
import { useDrupalApi } from '@stir/base/composables/useDrupalApi'
const { dataReady, isAdministrator, page } = await useDrupalApi()
</script>

<template>
  <SiteMessages />
  <main
    id="main-content"
    :class="{
      'mt-28':
        !page.content.hero ||
        (page.content.hero.length === 0 && !isAdministrator),
      'mt-12': !page.content.hero && isAdministrator,
    }"
    tabindex="-1"
  >
    <ParagraphHero
      v-if="page.content.hero && page.content.hero.length > 0"
      :hero="page.content.hero[0]"
      :page-title="page.title"
      :site-slogan="page.site_info.slogan"
    />
    <h1 v-else class="mb-2 text-center text-6xl">{{ page.title }}</h1>
    <slot />
  </main>
  <LazyAppFooter v-if="dataReady" :site="page" />
</template>
