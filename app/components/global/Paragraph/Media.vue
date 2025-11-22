<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'

interface MediaProps {
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  randomize?: boolean
  gridItems?: string
  spacing?: string
  widthClass?: string
  overlay?: boolean
  align?: string
  direction?: string
  editLink?: string
  isMatrix?: boolean
}

const props = defineProps<MediaProps>()

// Slot access
const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)

const theme = useAppConfig().stirTheme
const breakpoints = useBreakpoints(breakpointsTailwind)

// Normalize media slots
const slotMedia = computed(() => tk.mediaItems())

const isVideo = (vnode: any) => !!vnode?.props?.mediaEmbed
const isDocument = (vnode: any) => vnode?.props?.type === 'document'
const isAudio = (vnode: any) => vnode?.props?.type === 'audio'

const gridClasses = computed(() =>
  [props.overlay ? '' : props.gridItems, props.widthClass, props.spacing]
    .filter(Boolean)
    .join(' '),
)

// modal state
const open = ref(false)
const activeIndex = ref(0)
const startIndex = ref(0)

// matrix layout
const isMatrixLayout = computed(() => !!props.isMatrix)

const columnCount = computed(() => {
  if (!isMatrixLayout.value) return 1

  const map: Record<string, number> = {}
  props.gridItems?.split(/\s+/).forEach((cls) => {
    const match = cls.match(/(?:(\w+):)?columns-(\d+)/)
    if (match) map[match[1] || 'base'] = parseInt(match[2])
  })

  const order = ['2xl', 'xl', 'lg', 'md', 'sm']
  for (const bp of order) {
    if (breakpoints.greaterOrEqual(bp).value && map[bp]) return map[bp]
  }

  return map.base || 1
})

const baseIndices = computed(() => slotMedia.value.map((_, i) => i))

function computeMatrixDomOrder() {
  if (!isMatrixLayout.value) return baseIndices.value

  const cols = columnCount.value
  const buckets: number[][] = Array.from({ length: cols }, () => [])

  baseIndices.value.forEach((idx, i) => buckets[i % cols].push(idx))

  return buckets.flat()
}

const orderedIndices = tk.hydrateOrder(
  () => baseIndices.value,
  () => computeMatrixDomOrder(),
)

const slotMediaOrdered = computed(() =>
  orderedIndices.value.map((i) => slotMedia.value[i]),
)

// Items for modal
const itemsOrdered = computed(() =>
  baseIndices.value.map((i) => {
    const vnode = slotMedia.value[i]
    const p = tk.propsOf(vnode)
    return {
      ...p,
      key: p.mid || p.src || JSON.stringify(p),
      type: p.type,
    }
  }),
)

const activeItem = computed(() => itemsOrdered.value[activeIndex.value] ?? null)

const modalTitle = computed(() => activeItem.value?.title || '')
const modalDescription = computed(
  () => activeItem.value?.alt || activeItem.value?.credit || '',
)
const modalCredit = computed(() => activeItem.value?.credit || '')

// Grid → modal index
function openModal(domIdx: number) {
  const initialIndex = orderedIndices.value[domIdx] ?? domIdx
  startIndex.value = initialIndex
  activeIndex.value = initialIndex
  open.value = true
}

function onSelect(index: number) {
  activeIndex.value = index
}

// Embeds
const AudioEmbed = {
  props: {
    mediaEmbed: { type: String, required: true },
  },
  template: '<div v-html="mediaEmbed"></div>',
}

const DocumentEmbed = resolveComponent('MediaDocument')

// Component map
const componentMap = {
  image: resolveComponent('MediaImage'),
  video: resolveComponent('MediaVideo'),
  audio: AudioEmbed,
  document: DocumentEmbed,
}
</script>

<template>
  <EditLink :link="props.editLink">
    <WrapAlign :align="props.align">
      <WrapGrid :classes="gridClasses" :header="props.header">
        <WrapAnimate class="relative" :effect="props.direction">
          <div :class="props.gridItems">
            <template v-for="(node, i) in slotMediaOrdered" :key="i">
              <!-- DOCUMENTS & AUDIO should NOT show image hover wrapper -->
              <component
                :is="componentMap[tk.propsOf(node).type]"
                v-if="isDocument(node) || isAudio(node)"
                v-bind="tk.propsOf(node)"
              />

              <!-- IMAGES + VIDEO thumbnails (clickable) -->
              <div
                v-else
                class="group relative overflow-hidden"
                :class="[
                  theme.media.rounded,
                  isVideo(node) || props.overlay ? 'cursor-pointer' : '',
                ]"
                @click="(isVideo(node) || props.overlay) && openModal(i)"
              >
                <div
                  class="transition-transform duration-300 group-hover:scale-105"
                >
                  <MediaImage
                    v-bind="{ ...tk.propsOf(node), hideCredit: true }"
                  />
                </div>

                <span
                  v-if="tk.propsOf(node).credit"
                  class="absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2"
                >
                  {{ tk.propsOf(node).credit }}
                </span>

                <template v-if="isVideo(node)">
                  <div
                    class="absolute inset-0 z-10 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10"
                  />
                  <button
                    aria-label="Play Video"
                    class="absolute inset-0 z-20 flex items-center justify-center text-white transition-transform duration-300 hover:scale-110"
                  >
                    <UIcon name="i-heroicons-play-circle" size="60" />
                  </button>
                </template>
              </div>
            </template>
          </div>
        </WrapAnimate>
      </WrapGrid>
    </WrapAlign>
  </EditLink>

  <UModal
    v-model:open="open"
    aria-modal="true"
    :close="false"
    :description="modalDescription"
    fullscreen
    :title="modalTitle"
    :ui="{
      content: 'bg-transparent divide-none p-0',
      header: 'hidden',
      title: 'hidden',
      description: 'hidden',
    }"
  >
    <template #body>
      <UButton
        class="absolute top-4 right-4 z-10"
        color="neutral"
        icon="i-lucide-x"
        size="lg"
        variant="soft"
        @click="open = false"
      />

      <LazyUCarousel
        v-if="open && itemsOrdered.length"
        :arrows="itemsOrdered.length > 1"
        :items="itemsOrdered"
        loop
        :next="theme.carousel.arrows?.next"
        :next-icon="theme.carousel.arrows?.nextIcon"
        :prev="theme.carousel.arrows?.prev"
        :prev-icon="theme.carousel.arrows?.prevIcon"
        :start-index="startIndex"
        :ui="{ container: 'items-center h-full' }"
        @select="onSelect"
      >
        <template #default="{ item }">
          <div :class="['overflow-hidden', theme.media.rounded]">
            <component
              :is="componentMap[item.type]"
              :key="item.key"
              v-bind="{
                ...item,
                ...(item.type === 'image' ? { noWrapper: true } : {}),
              }"
            />
          </div>
        </template>
      </LazyUCarousel>

      <div
        v-if="
          (theme.modal.title && modalTitle) ||
          (theme.modal.description && modalDescription) ||
          modalCredit
        "
        class="absolute bottom-6 left-1/2 max-w-[90%] -translate-x-1/2 space-y-1 rounded-lg bg-black/60 px-4 py-3 text-center text-white backdrop-blur-sm"
      >
        <div v-if="theme.modal.title && modalTitle" class="font-semibold">
          {{ modalTitle }}
        </div>

        <div
          v-if="theme.modal.description && modalDescription"
          class="text-sm opacity-80"
        >
          {{ modalDescription }}
        </div>

        <div v-if="modalCredit" class="text-xs italic opacity-70">
          {{ modalCredit }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@layer components {
  [role='dialog'] [aria-roledescription='carousel'],
  [role='dialog'] .overflow-hidden {
    @apply h-full;
  }
  [role='dialog'] img {
    @apply max-h-[80vh] object-contain;
  }
}
</style>
