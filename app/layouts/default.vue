<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const appConfig = useAppConfig()

const heroClasses = computed(() => ({
  'pt-[3.9rem]': isAdministrator,
  [appConfig.stirTheme.main]: !page.value?.content?.hero,
}))
</script>

<template>
  <DrupalTabs v-if="isAdministrator" />
  <header aria-label="Site header">
    <NavigationMain />
  </header>
  <main id="main-content" role="main" :class="heroClasses">
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
