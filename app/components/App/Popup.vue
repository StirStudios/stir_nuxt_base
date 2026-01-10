<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { usePopupData } from '~/composables/usePopupData'
import { dayKey } from '~/utils/timeUtils'

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
const cardGradientLayout = computed(() => ({
  card: true,
  compact: true,
}))

const popupRenderProps = computed(() => {
  if (!popup.value) return {}

  const {
    id,
    uuid,
    parentUuid,
    region,
    text,
    alert,
    webform,
    editLink,
    direction,
  } = popup.value.props ?? {}

  return {
    id,
    uuid,
    parentUuid,
    region,
    text,
    alert,
    webform,
    editLink,
    direction,
  }
})

const activeSchedules = computed(() => {
  const schedules = popup.value?.slots?.popupSchedule
  if (!Array.isArray(schedules) || !schedules.length) return []

  const now = new Date()
  const today = dayKey(now) // LA day (your default)

  const parsed = schedules
    .map((item) => {
      const start = item?.props?.dateStart
        ? new Date(item.props.dateStart + 'Z') // CMS = UTC
        : null
      const end = item?.props?.dateEnd
        ? new Date(item.props.dateEnd + 'Z')
        : null

      return start && end
        ? {
            item,
            start,
            end,
            day: dayKey(start),
            isLive: now >= start && now <= end,
          }
        : null
    })
    .filter(Boolean) as {
    item: any
    start: Date
    end: Date
    day: string
    isLive: boolean
  }[]

  parsed.sort((a, b) => +a.start - +b.start)

  // 1) ALL games today (past + future)
  const todayAll = parsed.filter(({ day }) => day === today)
  if (todayAll.length) return todayAll

  // 2) Otherwise: next future day
  const next = parsed.find(({ start }) => start > now)
  return next ? parsed.filter(({ day }) => day === next.day) : []
})

function formatScheduleLabel(start?: Date) {
  return start ? formatZonedDateTime(start) : null
}

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

          <template v-if="activeSchedules.length" #schedule>
            <UAlert
              v-if="popupRenderProps.alert"
              color="info"
              :ui="{
                root: 'rounded-none',
                title: 'text-center font-bold uppercase',
              }"
            >
              <template #title>
                {{ popupRenderProps.alert }}
              </template>
            </UAlert>
            <div class="relative overflow-hidden bg-black/90 p-5 text-white">
              <CardGradient :layout="cardGradientLayout" />
              <UCarousel
                v-slot="{ item: schedule }"
                :autoplay="activeSchedules.length > 1 ? { delay: 3000 } : false"
                :items="activeSchedules"
                :loop="activeSchedules.length > 1"
                :ui="{
                  item: 'basis-full',
                  container: 'relative text-center',
                }"
              >
                <UBadge
                  :class="[
                    schedule.isLive
                      ? 'animate-pulse'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                  ]"
                  :color="schedule.isLive ? 'error' : undefined"
                  :icon="schedule.isLive ? 'i-lucide-radio' : 'i-lucide-clock'"
                  size="md"
                  :variant="schedule.isLive ? 'solid' : 'soft'"
                >
                  {{ schedule.isLive ? 'Live' : 'Next Up' }}
                </UBadge>

                <div v-html="schedule.item.props?.text" />
                <em v-if="schedule.start">
                  {{ formatScheduleLabel(schedule.start) }}
                </em>
              </UCarousel>
            </div>
          </template>
        </ParagraphPopup>
      </template>
    </UModal>
  </ClientOnly>
</template>
