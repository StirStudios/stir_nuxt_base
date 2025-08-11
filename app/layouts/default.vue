<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { header, hero } = useAppConfig().stirTheme
</script>

<template>
  <RegionArea area="top" />
  <header aria-label="Site header" :class="header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main
    id="main-content"
    :class="page.content.hide === 'true' ? hero.hide : ''"
    role="main"
  >
    <SiteMessages />
    <slot />
  </main>
  <RegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
