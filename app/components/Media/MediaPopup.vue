<script lang="ts" setup>
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const appConfig = useAppConfig()

const props = defineProps<{
  media?: MediaProps[]
}>()

const modal = ref(false)
</script>

<template>
  <div v-if="props.media && props.media.length" class="space-y-4">
    <div
      v-for="(item, index) in props.media"
      :key="index"
      :class="[appConfig.stirTheme.mediaRounded, 'overflow-hidden']"
    >
      <div
        :class="[
          'relative transform-gpu overflow-hidden transition-transform duration-500 ease-in-out will-change-transform hover:scale-110',
          aspectRatios(item.width, item.height),
          'before:absolute before:inset-0 before:z-0 before:bg-black before:opacity-40',
        ]"
      >
        <img
          :alt="item.alt"
          class="absolute z-[-1] h-full w-full object-cover"
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
            class="transform-gpu transition-transform duration-500 ease-in-out will-change-transform hover:scale-125 hover:drop-shadow-md"
            color="white"
            name="i-heroicons-play-circle"
            size="60"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>
      <UModal
        v-model:open="modal"
        fullscreen
        title="Media Viewer"
        :description="item.alt"
      >
        <template #header>
          <div class="flex items-center justify-end">
            <UButton
              color="primary"
              icon="i-heroicons-x-mark-20-solid"
              variant="ghost"
              class="rounded-md"
              @click="modal = false"
            />
          </div>
        </template>
        <template #body>
          <div
            v-if="item.mediaEmbed"
            class="flex min-h-[90vh] w-full items-center justify-center"
          >
            <div
              :class="[
                'relative w-full overflow-hidden rounded-xl xl:max-w-[50vw]',
                appConfig.stirTheme.mediaRounded,
                aspectRatios(item.width, item.height),
              ]"
            >
              <iframe
                v-if="modal"
                :src="item.mediaEmbed"
                :title="item.title"
                class="absolute top-0 left-0 h-full w-full"
                frameborder="0"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
          <div v-else class="m-10 flex justify-center overflow-auto">
            <img
              :alt="item.alt"
              :class="[
                appConfig.stirTheme.mediaRounded,
                'max-h-[80vh] w-auto object-contain',
              ]"
              :src="item.src"
              :width="item.width"
              :height="item.height"
            />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
