<script setup lang="ts">
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'
import { useMediaOrdering } from '~/composables/useMediaOrdering'
import { useMediaModal } from '~/composables/useMediaModal'

const props = defineProps<{
  /* Identity */
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  /* Layout */
  gridItems?: string
  spacing?: string
  widthClass?: string
  align?: string
  direction?: string
  overlay?: boolean
  isMatrix?: boolean

  /* Content */
  label?: string
  header?: string
  headerTag?: string

  /* Behavior */
  randomize?: boolean
  editLink?: string
}>()

const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)
const theme = useAppConfig().stirTheme

const slotMedia = computed(() => tk.mediaItems())

type VNodeLoose = {
  props?: Record<string, unknown>
  [key: string]: unknown
}

const isVideo = (vnode: VNodeLoose) => !!vnode?.props?.mediaEmbed
const isDocument = (vnode: VNodeLoose) => vnode?.props?.type === 'document'
const isAudio = (vnode: VNodeLoose) => vnode?.props?.type === 'audio'

const { baseIndices, orderedIndices } = useMediaOrdering(slotMedia, props, tk)

const slotMediaOrdered = computed(() =>
  orderedIndices.value.map((i) => slotMedia.value[i]),
)

const {
  open,
  startIndex,
  itemsOrdered,
  modalTitle,
  modalDescription,
  modalCredit,
  openModal,
  onSelect,
} = useMediaModal(slotMedia, baseIndices, tk)

const componentMap = {
  image: resolveComponent('MediaImage'),
  video: resolveComponent('MediaVideo'),
  document: resolveComponent('MediaDocument'),
  audio: resolveComponent('MediaAudio'),
  link: resolveComponent('MediaLink'),
}
</script>

<template>
  <EditLink :link="editLink">
    <WrapAlign :align="align">
      <component :is="headerTag || 'h2'" v-if="header">
        {{ header }}
      </component>

      <WrapAnimate class="relative" :effect="direction">
        <WrapGrid
          :grid-items="gridItems"
          :spacing="spacing"
          :width="widthClass"
        >
          <template v-for="(node, i) in slotMediaOrdered" :key="i">
            <!-- DOCUMENTS & AUDIO should NOT show image hover wrapper -->
            <component
              :is="componentMap[tk.propsOf(node).type]"
              v-if="!overlay || isDocument(node) || isAudio(node)"
              v-bind="tk.propsOf(node)"
            />

            <!-- IMAGES + VIDEO thumbnails (clickable) -->
            <div
              v-else
              class="group relative overflow-hidden"
              :class="[
                theme.media.rounded,
                isVideo(node) || overlay ? 'cursor-pointer' : '',
              ]"
              @click="
                (isVideo(node) || overlay) && openModal(i, orderedIndices)
              "
            >
              <div
                :class="[
                  'transition-transform',
                  theme.media.effects.scale,
                  theme.media.transitions.slow,
                ]"
              >
                <MediaImage
                  v-bind="{ ...tk.propsOf(node), hideCredit: true }"
                />
              </div>

              <span
                v-if="tk.propsOf(node).credit"
                :class="[
                  'absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2',
                  theme.media.transitions.fast,
                ]"
              >
                {{ tk.propsOf(node).credit }}
              </span>

              <template v-if="isVideo(node)">
                <div
                  :class="[
                    'group-hover:bg-black/10] absolute inset-0 z-10 bg-black/30 transition-colors',
                    theme.media.transitions.slow,
                  ]"
                />
                <button
                  aria-label="Play Video"
                  :class="[
                    'absolute inset-0 z-20 flex items-center justify-center text-white transition-transform',
                    theme.media.transitions.slow,
                    theme.media.effects.scale,
                  ]"
                >
                  <UIcon name="i-lucide-play-circle" size="60" />
                </button>
              </template>
            </div>
          </template>
        </WrapGrid>
      </WrapAnimate>
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

      <div
        v-if="itemsOrdered.length === 1"
        class="flex h-full items-center justify-center"
      >
        <div class="w-full">
          <component
            :is="componentMap[itemsOrdered[0].type]"
            v-bind="{
              ...itemsOrdered[0],
              ...(itemsOrdered[0].type === 'image' ? { noWrapper: true } : {}),
            }"
          />
        </div>
      </div>

      <LazyUCarousel
        v-else
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

      <Transition
        appear
        :enter-active-class="`
          transform transition ease-out delay-150
          ${theme.media.transitions.fast}
        `"
        enter-from-class="translate-y-20 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
      >
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

          <div v-if="modalCredit" class="text-xs italic opacity-80">
            {{ modalCredit }}
          </div>
        </div>
      </Transition>
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
