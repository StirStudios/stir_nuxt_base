<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { isAdministrator } = usePageContext()
const { navigation } = useAppConfig().stirTheme
</script>

<template>
  <LazyRegionArea area="top" />

  <LazyDrupalTabs v-if="isAdministrator" />

  <AppHeader :mode="navigation.mode" />

  <UMain id="main-content" as="main" role="main">
    <LazySiteMessages />

    <slot />
  </UMain>

  <LazyRegionArea area="sub_footer" />

  <LazyAppFooter />
</template>
