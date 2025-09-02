<script lang="ts" setup>
import type { MediaProps } from '@stir/base/types/MediaTypes'
import { useMediaQuery } from '@vueuse/core'

const {
  media: { rounded },
} = useAppConfig().stirTheme

defineProps<{
  media?: MediaProps[]
}>()

const zoomedIndex = ref<number | null>(null)
const origins = ref<Record<number, string>>({})

// SSR-safe media query for min-width: 1024px (Tailwind lg)
const isDesktop = useMediaQuery('(min-width: 1024px)', { ssrWidth: 320 })

const updateOrigin = (i: number, e: MouseEvent) => {
  const x = e.clientX
  const origin = x < window.innerWidth / 2 ? 'top left' : 'top right'
  origins.value[i] = origin
}

const toggleZoom = (i: number, e: MouseEvent) => {
  if (!isDesktop.value) return
  updateOrigin(i, e)
  zoomedIndex.value = zoomedIndex.value === i ? null : i
}
</script>

<template>
  <div v-if="media?.length" class="relative space-y-4">
    <div
      v-for="(item, index) in media"
      :key="index"
      :class="[
        rounded,
        'group relative transition-transform duration-300',
        zoomedIndex === index ? 'z-50 overflow-visible' : 'overflow-hidden',
      ]"
    >
      <div
        class="cursor-pointer transition-transform duration-300 ease-in-out"
        :class="[
          aspectRatios(item.width, item.height),
          zoomedIndex === index && isDesktop
            ? 'scale-150 cursor-zoom-out'
            : 'scale-100 cursor-zoom-in',
        ]"
        :style="
          zoomedIndex === index
            ? { transformOrigin: origins[index] || 'center' }
            : undefined
        "
        @click="(e) => toggleZoom(index, e)"
      >
        <MediaImage class="h-full w-full object-contain" :item="item" />
      </div>

      <span
        v-if="item.credit"
        :class="[
          'absolute right-0 bottom-0 rounded bg-black/40 p-2 text-xs font-bold text-white transition-opacity duration-300',
          zoomedIndex === index
            ? 'opacity-0'
            : 'opacity-0 group-hover:opacity-100',
        ]"
      >
        {{ item.credit }}
      </span>
    </div>
  </div>
</template>
