<script lang="ts" setup>
import type { MediaProps } from '~/types/MediaTypes'

const {
  media: { rounded },
  modal: { header },
} = useAppConfig().stirTheme

const props = defineProps<{
  media?: MediaProps[]
  grid?: string
}>()

const modal = ref(false)
const activeMedia = ref<MediaProps | null>(null)
const activeIndex = ref(0)
const carousel = useTemplateRef('carousel')
const appConfig = useAppConfig()

const modalContentClass = computed(() =>
  props.media?.length && !activeMedia.value?.mediaEmbed
    ? 'w-full'
    : 'max-w-5xl ring-0',
)

const items = computed(() => props.media?.filter((m) => !m.mediaEmbed) || [])

const openModal = (item: MediaProps) => {
  const index = items.value.findIndex((m) => m.mid === item.mid)
  activeIndex.value = index >= 0 ? index : 0
  activeMedia.value = item
  modal.value = true
}
</script>

<template>
  <div v-if="media?.length" :class="['aspect-wrap', grid]">
    <div
      v-for="(item, index) in media"
      :key="index"
      :class="[rounded, 'overflow-hidden']"
    >
      <div class="group relative overflow-hidden">
        <MediaImage :item="item" :link="true" @click="openModal(item)" />
        <div
          v-if="item.mediaEmbed"
          class="absolute inset-0 z-10 bg-black opacity-30 transition-opacity duration-300 group-hover:opacity-10"
        />
        <button
          v-if="item.mediaEmbed"
          aria-label="Play Video"
          class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:drop-shadow-md"
          @click="openModal(item)"
        >
          <UIcon
            aria-hidden="true"
            color="white"
            name="i-heroicons-play-circle"
            size="60"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>
    </div>

    <UModal
      v-if="activeMedia"
      v-model:open="modal"
      :description="activeMedia?.alt"
      :fullscreen="media?.length && !activeMedia?.mediaEmbed"
      :title="activeMedia?.title"
      :ui="{
        header: !activeMedia?.mediaEmbed
          ? 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16'
          : 'sr-only',
        content: modalContentClass,
        body: activeMedia?.mediaEmbed ? '!p-0 bg-transparent' : undefined,
        title: header
          ? 'text-highlighted font-semibold text-xl mb-0'
          : 'sr-only',
        description: 'sr-only',
      }"
    >
      <template #body>
        <div
          :class="[
            'relative z-10 h-full',
            !activeMedia?.mediaEmbed
              ? appConfig.stirTheme.carousel.padding
              : '',
          ]"
        >
          <UCarousel
            v-if="items.length && !activeMedia?.mediaEmbed"
            ref="carousel"
            v-model="activeIndex"
            :arrows="items.length > 1"
            :items="items"
            :next="appConfig.stirTheme.carousel.arrows.next"
            :next-icon="appConfig.stirTheme.carousel.arrows.nextIcon"
            :prev="appConfig.stirTheme.carousel.arrows.prev"
            :prev-icon="appConfig.stirTheme.carousel.arrows.prevIcon"
            :start-index="activeIndex"
            :ui="{ container: 'items-center h-full' }"
          >
            <template #default="{ item }">
              <MediaImage :key="item.mid" :item="item" />
            </template>
          </UCarousel>
          <MediaVideo
            v-if="activeMedia?.mediaEmbed"
            :key="activeMedia.mid"
            :item="activeMedia"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
[role='dialog'] {
  [aria-roledescription='carousel'],
  .overflow-hidden {
    @apply h-full;
  }
  img {
    @apply max-h-[80vh] object-contain;
  }
}
</style>
