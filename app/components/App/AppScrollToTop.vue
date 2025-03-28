<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const theme = useAppConfig().stirTheme.scrollButton

const showButton = computed(() => y.value > theme.showAtScrollY)

const scrollToTop = () => {
  y.value = 0
}
</script>

<template>
  <ClientOnly>
    <UButton
      aria-label="Scroll to top of page"
      :class="[theme.base, showButton ? 'opacity-100' : 'opacity-0']"
      @click="scrollToTop"
      :variant="theme.variant"
    >
      <UIcon aria-hidden="true" class="size-7" :name="theme.icon" />
      <span class="sr-only">Scroll to top of page</span>
    </UButton>
  </ClientOnly>
</template>
