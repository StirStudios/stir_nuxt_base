<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { usePopupData } from '~/composables/usePopupData'

const { renderCustomElements } = useDrupalCe()
const { popup, config } = usePopupData()
const { y } = useWindowScroll()
const open = ref(false)
const seen = useCookie('marketing_popup', { maxAge: 60 * 60 * 24 * 7 })
const hasTriggered = ref(false)

watch(
  () => popup.value?.props?.uuid,
  () => {
    hasTriggered.value = false
    selectedMedia.value = null
  },
)

const hasPopup = computed(() => !!popup.value)
const title = computed(
  () => popup.value?.props?.webform?.webformTitle ?? 'Announcement',
)

const description = computed(() => popup.value?.props?.text || '')
const popupRenderProps = computed(() => {
  if (!popup.value) return {}

  const { id, uuid, parentUuid, region, text, webform, editLink, direction } =
    popup.value.props ?? {}

  return {
    id,
    uuid,
    parentUuid,
    region,
    text,
    webform,
    editLink,
    direction,
  }
})

const selectedMedia = ref<CustomElement | null>(null)

watch(open, (isOpen) => {
  if (!isOpen) return

  const media = popup.value?.slots?.media
  if (!Array.isArray(media) || !media.length) {
    selectedMedia.value = null
    return
  }

  selectedMedia.value =
    media.length === 1
      ? media[0]
      : media[Math.floor(Math.random() * media.length)]
})

function showModalOnce() {
  if (open.value || (config.value.showOnce && seen.value)) return

  open.value = true

  if (config.value.showOnce) {
    seen.value = true
  }
}

function handleTrigger() {
  if (!popup.value) return
  if (hasTriggered.value) return

  hasTriggered.value = true

  if (config.value.trigger === 'delay') {
    setTimeout(showModalOnce, config.value.delay)
  }

  if (config.value.trigger === 'scroll') {
    const stop = watch(
      y,
      (val) => {
        const percent = val / (document.body.scrollHeight - window.innerHeight)

        if (percent > config.value.scrollThreshold) {
          showModalOnce()
          stop()
        }
      },
      { immediate: true },
    )
  }

  if (config.value.trigger === 'exit') {
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) {
        showModalOnce()
        document.removeEventListener('mouseout', onExitIntent)
      }
    }

    document.addEventListener('mouseout', onExitIntent)
  }
}

watch(
  popup,
  (val) => {
    if (val) handleTrigger()
  },
  { immediate: true },
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
        overlay: 'fixed inset-0 bg-black/60',
        content:
          'popup fixed bg-default divide-y divide-none flex flex-col focus:outline-none ring-0',
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
          aria-label="Close"
          class="absolute end-5 top-5 z-100"
          color="neutral"
          icon="i-lucide-x"
          variant="solid"
          @click="open = false"
        />

        <ParagraphPopup
          v-bind="popupRenderProps"
          :on-close="() => (open = false)"
        >
          <template #media>
            <component
              :is="renderCustomElements(selectedMedia)"
              v-if="selectedMedia"
            />
          </template>
        </ParagraphPopup>
      </template>
    </UModal>
  </ClientOnly>
</template>
