<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { header } = useAppConfig().stirTheme
</script>

<template>
  <LazyRegionArea area="top" />
  <div :class="header">
    <LazyDrupalTabs v-if="isAdministrator" />
    <AppHeader />
  </div>
  <UMain
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
  </UMain>
  <LazyRegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
