<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { header, hero } = useAppConfig().stirTheme
</script>

<template>
  <LazyRegionArea area="top" />
  <div :class="header">
    <LazyDrupalTabs v-if="!isAdministrator" />
    <AppHeader />
  </div>
  <main
    id="main-content"
    :class="
      page.content.hide === true || page.content.hide === 'true'
        ? hero.hide
        : ''
    "
    role="main"
  >
    <LazySiteMessages />
    <slot />
  </main>
  <LazyRegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
