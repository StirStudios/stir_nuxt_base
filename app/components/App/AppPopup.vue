<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const open = ref(false)
const route = useRoute()
const config = useAppConfig()
const seen = useCookie('marketing_popup', { maxAge: 60 * 60 * 24 * 7 })

const appPopup = config.appPopup ?? {}
const {
  enabled = false,
  delay = 0,
  pages = '*',
  excludePages = [],
  showOnce = false,
  trigger = 'scroll',
  scrollThreshold = 0.25,
} = appPopup

const shouldShowOnPage = computed(() => {
  if (pages === '*') {
    return !excludePages?.includes(route.path)
  }

  return Array.isArray(pages) && pages.includes(route.path)
})

function showModalOnce() {
  if (open.value || (showOnce && seen.value)) return
  open.value = true
  if (showOnce) seen.value = true
}

function handleTrigger() {
  if (!enabled || !shouldShowOnPage.value) return

  if (trigger === 'delay' && delay) {
    setTimeout(showModalOnce, delay)
  }

  if (trigger === 'scroll') {
    // declare first so the symbol exists before the watcher executes
    let stop: (() => void) | undefined

    stop = watch(
      y,
      (val) => {
        const percent = val / (document.body.scrollHeight - window.innerHeight)
        if (percent > scrollThreshold) {
          showModalOnce()
          // guard to avoid TDZ / undefined calls
          if (stop) stop()
        }
      },
      { immediate: true },
    )
  }

  if (trigger === 'exit') {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showModalOnce()
        document.removeEventListener('mouseleave', onMouseLeave)
      }
    }
    document.addEventListener('mouseleave', onMouseLeave)
  }
}

onMounted(handleTrigger)
watch(() => route.path, handleTrigger)
</script>

<template>
  <UModal v-model:open="open" title="Join Our Newsletter">
    <template #body>
      <p class="mb-4">
        Get early access to exclusive offers and upcoming events!
      </p>
      <UInput placeholder="Enter your email" />
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" label="Maybe later" @click="close" />
      <UButton label="Sign up" @click="close" />
    </template>
  </UModal>
</template>
