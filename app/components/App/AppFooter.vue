<script lang="ts" setup>
import { usePageContext } from '~/composables/usePageContext'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer
    aria-label="Site Footer"
    class="mt-20 bg-gray-100 py-10 text-sm dark:bg-black"
  >
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
