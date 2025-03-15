<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator, isFront } = usePageContext()
const appConfig = useAppConfig()

const heroClasses = computed(() => ({
  [isFront.value && appConfig.stirTheme.front?.main
    ? appConfig.stirTheme.front.main
    : appConfig.stirTheme.main || '']: !page.value?.content?.hero,
  'mt-[3.1rem]': isAdministrator.value,
}))
</script>

<template>
  <header aria-label="Site header" :class="appConfig.stirTheme.header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main id="main-content" role="main" :class="heroClasses">
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
