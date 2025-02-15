<script lang="ts" setup>
import { usePageContext } from '~/composables/usePageContext'

const appConfig = useAppConfig()
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer aria-label="Site Footer" :class="appConfig.stirTheme.footer">
    <UContainer>
      <div class="text-center">
        <NavigationAccount />
        <p class="mb-0 leading-relaxed">
          © {{ currentYear }}. All Rights Reserved.
        </p>
      </div>
    </UContainer>
  </footer>
</template>
