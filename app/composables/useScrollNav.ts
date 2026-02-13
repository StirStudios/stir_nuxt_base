import { useWindowScroll, useThrottleFn } from '@vueuse/core'
import { usePageContext } from '~/composables/usePageContext'

export function useScrollNav(baseScrollThreshold = 10, directionDelta = 10) {
  if (!import.meta.client) {
    return {
      isScrolled: ref(false),
      showNavbar: ref(true),
      scrollDirection: ref(null),
      atBottom: ref(false),
    }
  }

  const { y, directions, arrivedState } = useWindowScroll({
    behavior: 'smooth',
  })

  const { isAdministrator } = usePageContext()
  const adjustedScrollThreshold = computed(() =>
    isAdministrator.value ? baseScrollThreshold + 40 : baseScrollThreshold,
  )

  const lastScrollPosition = ref(0)
  const showNavbar = ref(true)
  const isScrolled = computed(() => y.value > 50)
  const scrollDirection = ref<'up' | 'down' | null>(null)
  const atBottom = computed(() => arrivedState.bottom)
  const handleScroll = useThrottleFn(() => {
    const current = y.value
    const delta = current - lastScrollPosition.value

    if (directions.bottom) {
      scrollDirection.value = 'down'
    } else if (directions.top) {
      scrollDirection.value = 'up'
    }

    if (current <= adjustedScrollThreshold.value) {
      showNavbar.value = true
    } else if (delta > directionDelta) {
      showNavbar.value = false
    } else if (delta < -directionDelta && !atBottom.value) {
      showNavbar.value = true
    }

    lastScrollPosition.value = current
  }, 100)

  watch(y, handleScroll, { immediate: true })

  return {
    isScrolled,
    showNavbar,
    scrollDirection,
    atBottom,
  }
}
