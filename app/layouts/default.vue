<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const { hero } = useAppConfig().stirTheme
</script>

<template>
  <LazyRegionArea area="top" />
  <AppHeader />
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
