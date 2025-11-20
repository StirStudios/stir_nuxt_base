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
  header?: string
  isMatrix?: boolean
}

const props = defineProps<MediaProps>()

// Unified slot access
const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)

const theme = useAppConfig().stirTheme
const breakpoints = useBreakpoints(breakpointsTailwind)

// raw <slot name="media">
const slotMedia = computed(() => tk.mediaItems())

const isVideo = (vnode: any) => !!vnode?.props?.mediaEmbed

const gridClasses = computed(() =>
  [props.overlay ? '' : props.gridItems, props.widthClass, props.spacing]
    .filter(Boolean)
    .join(' '),
)

// modal
const open = ref(false)
const activeIndex = ref(0) // current slide (for metadata)
const startIndex = ref(0) // ONLY used to initialize carousel

// matrix
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

// stable SSR order
const baseIndices = computed(() => slotMedia.value.map((_, i) => i))

// CLIENT-ONLY matrix reorder
function computeMatrixDomOrder() {
  if (!isMatrixLayout.value) return baseIndices.value

  const cols = columnCount.value
  const buckets: number[][] = Array.from({ length: cols }, () => [])

  baseIndices.value.forEach((idx, i) => {
    buckets[i % cols].push(idx)
  })

  return buckets.flat()
}

const orderedIndices = tk.hydrateOrder(
  () => baseIndices.value, // SSR
  () => computeMatrixDomOrder(), // CSR
)

// ordered vnodes for grid
const slotMediaOrdered = computed(() =>
  orderedIndices.value.map((i) => slotMedia.value[i]),
)

// display items (grid keys)
const displayItems = computed(() =>
  orderedIndices.value.map((i) => {
    const vnode = slotMedia.value[i]
    const p = tk.propsOf(vnode)
    return {
      ...p,
      key: p.mid || p.src || JSON.stringify(p),
      type: p.type,
    }
  }),
)

// modal items always use base order (correct behavior)
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

// Current modal item (reactive + follows carousel)
const activeItem = computed(() => itemsOrdered.value[activeIndex.value] || null)

// Modal metadata
const modalTitle = computed(() => activeItem.value?.title || '')

const modalDescription = computed(
  () => activeItem.value?.alt || activeItem.value?.credit || '',
)

// Called when the user clicks a thumb in the grid
function openModal(domIdx: number) {
  const initialIndex = orderedIndices.value[domIdx] ?? domIdx
  startIndex.value = initialIndex // used once when carousel mounts
  activeIndex.value = initialIndex // metadata matches immediately
  open.value = true
}

// Called when Embla selects a new slide
function onSelect(index: number) {
  activeIndex.value = index
}

const componentMap = {
  video: resolveComponent('MediaVideo'),
  image: resolveComponent('MediaImage'),
}
</script>

<template>
  <EditLink :link="props.editLink">
    <WrapAlign :align="props.align">
      <WrapGrid :classes="gridClasses" :header="props.header">
        <WrapAnimate class="relative" :effect="props.direction">
          <div
            class="aspect-wrap relative overflow-hidden"
            :class="[props.gridItems, theme.media.rounded]"
          >
            <template
              v-for="(node, i) in slotMediaOrdered"
              :key="displayItems[i].key"
            >
              <div
                class="group relative"
                :class="isVideo(node) || props.overlay ? 'cursor-pointer' : ''"
                @click="(isVideo(node) || props.overlay) && openModal(i)"
              >
                <template v-if="isVideo(node) && node.props?.src">
                  <img
                    :alt="node.props.alt || 'Video thumbnail'"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    :src="node.props.src"
                  />
                </template>

                <component
                  :is="node"
                  v-else
                  :class="[
                    isVideo(node) || props.overlay
                      ? 'transition-transform duration-300 group-hover:scale-105'
                      : '',
                  ]"
                />

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
    :description="modalDescription"
    fullscreen
    :title="modalTitle"
    :ui="{ content: 'bg-transparent divide-none' }"
  >
    <template #body>
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
          <component
            :is="componentMap[item.type]"
            :key="item.key"
            v-bind="{
              ...item,
              ...(item.type === 'image' ? { noWrapper: true } : {}),
            }"
          />
        </template>
      </LazyUCarousel>
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
