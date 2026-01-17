<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { isAdministrator } = usePageContext()
const { navigation, error: errorConfig } = useAppConfig().stirTheme

defineProps<{ error: NuxtError }>()
</script>

<template>
  <LazyRegionArea area="top" />
  <LazyDrupalTabs />
  <AppHeader :mode="navigation.mode" />

  <UMain id="main-content" as="main" role="main">
    <UError
      :clear="{
        label: errorConfig.label,
        color: errorConfig.color,
        variant: errorConfig.variant,
      }"
      :ui="{
        links: 'mt-2',
        statusMessage: 'leading-tight',
      }"
      :error="error"
      redirect="/"
    />
  </UMain>

  <LazyRegionArea area="sub_footer" />
  <LazyAppFooter />
</template>
