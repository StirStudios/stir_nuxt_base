<script setup lang="ts">
const showButton = ref(false)

const appConfig = useAppConfig()

const handleScroll = () => {
  showButton.value =
    window.scrollY > appConfig.stirTheme.scrollButton.showAtScrollY
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
