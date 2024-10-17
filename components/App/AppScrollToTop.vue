<script setup lang="ts">
const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 200
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
      class="fixed bottom-4 left-4 z-50 rounded-full p-2 text-white shadow-md transition-opacity duration-300"
      :class="{ 'opacity-100': showButton, 'opacity-0': !showButton }"
      @click="scrollToTop"
    >
      <UIcon aria-hidden="true" class="size-7" name="i-heroicons:arrow-up" />
      <span class="sr-only">Scroll to top of page</span>
    </UButton>
  </ClientOnly>
</template>
