<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { header, hero } = useAppConfig().stirTheme
</script>

<template>
  <header aria-label="Site header" :class="header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main
    id="main-content"
    :class="page.content.hide ? hero.hide : ''"
    role="main"
  >
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
