import { useWindowScroll, useThrottleFn } from '@vueuse/core'

export function useScrollNav(scrollThreshold = 10, directionDelta = 10) {
  const { y } = useWindowScroll()
  const lastScrollPosition = ref(0)
  const showNavbar = ref(true)
  const isScrolled = computed(() => y.value > 50)

  const handleScroll = useThrottleFn(() => {
    const delta = y.value - lastScrollPosition.value
    if (delta > directionDelta) {
      showNavbar.value = false
    } else if (delta < -directionDelta) {
      showNavbar.value = true
    }
    lastScrollPosition.value = y.value
  }, 100)

  watch(
    y,
    (newY) => {
      if (newY <= scrollThreshold) {
        showNavbar.value = true
        return
      }
      handleScroll()
    },
    { immediate: true },
  )

  return {
    isScrolled,
    showNavbar,
  }
}
