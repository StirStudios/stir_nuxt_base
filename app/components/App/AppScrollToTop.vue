<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const appConfig = useAppConfig()

const showButton = computed(
  () => y.value > appConfig.stirTheme.scrollButton.showAtScrollY,
)

const scrollToTop = () => {
  y.value = 0
}
</script>

<template>
  <ClientOnly>
    <UButton
      aria-label="Scroll to top of page"
      :class="`${appConfig.stirTheme.scrollButton.base} ${showButton ? 'opacity-100' : 'opacity-0'}`"
      @click="scrollToTop"
      :variant="appConfig.stirTheme.scrollButton.variant"
    >
      <UIcon
        aria-hidden="true"
        class="size-7"
        :name="appConfig.stirTheme.scrollButton.icon"
      />
      <span class="sr-only">Scroll to top of page</span>
    </UButton>
  </ClientOnly>
</template>
