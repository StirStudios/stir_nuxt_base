<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { header, hero } = useAppConfig().stirTheme
const isHidden = computed(() =>
  ['true', '1', true, 1].includes(page.value?.content?.hide),
)
</script>

<template>
  <LazyRegionArea area="top" />
  <div :class="header">
    <LazyDrupalTabs v-if="isAdministrator" />
    <AppHeader />
  </div>
  <UMain id="main-content" :class="isHidden ? hero.hide : ''" role="main">
    <LazySiteMessages />
    <slot />
  </UMain>
  <LazyRegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
