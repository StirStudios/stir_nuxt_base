<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { usePopupData } from '~/composables/usePopupData'

const { popup, config } = usePopupData()
const { y } = useWindowScroll()
const open = ref(false)
const route = useRoute()
const seen = useCookie('marketing_popup', { maxAge: 60 * 60 * 24 * 7 })
const title = computed(() => popup.value?.webform?.webformTitle || '')
const description = computed(() => popup.value?.text || '')
const hasPopup = computed(() => !!popup.value)

function showModalOnce() {
  if (open.value || (config.value.showOnce && seen.value)) return
  open.value = true
  if (config.value.showOnce) seen.value = true
}

function handleTrigger() {
  if (!config.value.enabled || !popup.value) return

  if (config.value.trigger === 'delay' && config.value.delay) {
    setTimeout(showModalOnce, config.value.delay)
  }

  if (config.value.trigger === 'scroll') {
    let stop: (() => void) | undefined
    stop = watch(
      y,
      (val) => {
        const percent = val / (document.body.scrollHeight - window.innerHeight)
        if (percent > config.value.scrollThreshold) {
          showModalOnce()
          stop?.()
        }
      },
      { immediate: true },
    )
  }

  if (config.value.trigger === 'exit') {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showModalOnce()
        document.removeEventListener('mouseleave', onMouseLeave)
      }
    }
    document.addEventListener('mouseleave', onMouseLeave)
  }
}

onMounted(() => {
  if (hasPopup.value) handleTrigger()
})

watch(
  () => route.path,
  () => {
    if (hasPopup.value) handleTrigger()
  },
)
</script>

<template>
  <ClientOnly>
    <UModal
      v-if="hasPopup"
      v-model:open="open"
      :description="description"
      :title="title"
      :ui="{
        overlay: 'fixed inset-0 bg-elevated/75',
        content:
          'popup fixed bg-default divide-y divide-none flex flex-col focus:outline-none',
        header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16 sr-only',
        wrapper: '',
        body: 'flex-1 overflow-y-auto p-0 sm:p-0',
        footer: 'flex items-center gap-1.5 p-4 sm:px-6',
        title: 'text-highlighted font-semibold',
        description: 'mt-1 text-muted text-sm',
        close: 'absolute top-4 end-4',
      }"
    >
      <template #body>
        <UButton
          class="absolute end-5 top-5 z-100"
          color="neutral"
          icon="i-lucide-x"
          variant="solid"
          @click="open = false"
        />
        <ParagraphPopup :item="popup" :on-close="() => (open = false)" />
      </template>
    </UModal>
  </ClientOnly>
</template>
