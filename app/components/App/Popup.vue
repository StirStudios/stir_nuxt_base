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

const activeSchedule = computed(() => {
  const items = popup.value?.slots?.popupSchedule
  if (!Array.isArray(items) || !items.length) return null

  const now = new Date()

  const parsed = items
    .map((item) => {
      const start = item?.props?.dateStart
        ? new Date(item.props.dateStart + 'Z')
        : null
      const end = item?.props?.dateEnd
        ? new Date(item.props.dateEnd + 'Z')
        : null

      return { item, start, end }
    })
    .filter((x) => x.start && x.end)

  const active = parsed.find(({ start, end }) => now >= start && now <= end)
  if (active) return active

  const upcoming = parsed
    .filter(({ start }) => start > now)
    .sort((a, b) => +a.start - +b.start)[0]

  return upcoming ?? null
})

const formattedScheduleLabel = computed(() => {
  const start = activeSchedule.value?.start
  if (!start) return null

  return formatZonedDateTime(start)
})

const selectedMedia = ref<any>(null)

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

onMounted(() => {
  if (hasPopup.value) handleTrigger()
})

watch(popup, (val) => {
  if (val) handleTrigger()
})
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

          <template v-if="activeSchedule" #schedule>
            <UAlert
              v-if="activeSchedule.item.props?.alert"
              color="info"
              :ui="{
                root: 'rounded-none mb-2',
              }"
            >
              <template #title>
                {{ activeSchedule.item.props.alert }}
              </template>
            </UAlert>

            <div v-html="activeSchedule.item.props?.text" />

            <em v-if="formattedScheduleLabel">
              {{ formattedScheduleLabel }}
            </em>
          </template>
        </ParagraphPopup>
      </template>
    </UModal>
  </ClientOnly>
</template>
