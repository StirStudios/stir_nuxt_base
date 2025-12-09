<script setup lang="ts">
const { navigation } = useAppConfig().stirTheme
</script>

<template>
  <LazyRegionArea area="top" />
  <DrupalTabs />
  <AppHeader :mode="navigation.mode" />

  <UMain id="main-content" as="main" role="main">
    <LazySiteMessages />
    <slot />
  </UMain>

  <LazyRegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
