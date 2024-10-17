<script lang="ts" setup>
import type { Media } from '../types'

// Update props to accept an array of Media objects
const props = defineProps<{
  media?: Media[]
}>()

const modal = ref(false)

// Computed property to determine aspect ratio based on width and height
const aspectRatioClass = (width: number | null, height: number | null) => {
  if (width && height) {
    if (height === 480) {
      // Specifically handle height of 480 for 4:3 aspect ratio
      return 'aspect-[4/3]'
    }
    const ratio = width / height
    if (ratio > 1) {
      // Landscape (horizontal) 16:9 aspect ratio
      return 'aspect-[16/9]'
    } else if (ratio < 1) {
      // Portrait (vertical) 9:16 aspect ratio
      return 'aspect-[9/16]'
    } else {
      // Square 1:1 aspect ratio
      return 'aspect-square'
    }
  }
  return ''
}
</script>

<template>
  <div v-if="props.media && props.media.length" class="space-y-4">
    <div
      v-for="(item, index) in props.media"
      :key="index"
      class="overflow-hidden rounded-xl"
    >
      <div
        :class="[
          'relative overflow-hidden transition-all duration-300 hover:scale-110',
          aspectRatioClass(item.width, item.height),
        ]"
      >
        <img
          :alt="item.alt"
          class="absolute h-full w-full object-cover"
          :height="item.height"
          :loading="item.loading"
          :sizes="item.sizes"
          :src="item.src"
          :srcset="item.srcset"
          :width="item.width"
        />
        <button
          aria-label="Play Video"
          class="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-white"
          @click="modal = !modal"
        >
          <UIcon
            v-if="item.mediaEmbed"
            aria-hidden="true"
            aria-label="Play Video"
            class="transition duration-300 group-hover:scale-125 group-hover:drop-shadow group-hover:filter"
            color="white"
            name="i-heroicons-play-circle"
            size="60"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>

      <UModal
        fullscreen
        v-model="modal"
        aria-labelledby="modal-title"
        role="dialog"
        :ui="{
          background: 'bg-none',
          shadow: 'shadow-none',
        }"
      >
        <UCard
          :ui="{
            background: 'bg-none',
          }"
        >
          <template #header>
            <div class="flex items-center justify-end">
              <UButton
                color="primary"
                variant="solid"
                icon="i-heroicons-x-mark-20-solid"
                class="rounded-md"
                @click="modal = false"
              />
            </div>
          </template>

          <template v-if="item.mediaEmbed">
            <div class="flex min-h-[90vh] w-full items-center justify-center">
              <div
                :class="[
                  'relative w-full overflow-hidden rounded-xl xl:max-w-[50vw]',
                  aspectRatioClass(item.width, item.height),
                ]"
              >
                <iframe
                  v-if="modal"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  class="absolute left-0 top-0 h-full w-full"
                  frameborder="0"
                  loading="lazy"
                  :src="item.mediaEmbed"
                  :title="item.title"
                />
              </div>
            </div>
          </template>

          <template v-else>
            <div class="m-10 flex justify-center overflow-auto">
              <img
                :alt="item.alt"
                class="max-h-[80vh] w-auto rounded-xl object-contain"
                :height="item.height"
                :src="item.src"
                :width="item.width"
              />
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </div>
</template>
