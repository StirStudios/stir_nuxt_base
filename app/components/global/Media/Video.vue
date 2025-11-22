<script setup lang="ts">
import { aspectRatios } from '~/utils/aspectRatios'
import { useVideoPlayers } from '~/composables/useVideoPlayers'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  mid?: string | number
  title?: string
  alt?: string
  src?: string
  platform?: string
  width?: number
  height?: number
  mediaEmbed?: string
  noWrapper?: boolean
}>()

const theme = useAppConfig().stirTheme
const { media: mediaTheme } = theme
const { initializePlayers } = useVideoPlayers()

// Hero context: no wrapper visible
const isHero = inject<boolean>('isHero', false)
const isBare = computed(() => isHero || props.noWrapper === true)

// Bunny thumbnail while encoding
const isProcessing = computed(() => props.width === 180)

// Aspect ratio class utility
const aspectClass = computed(() =>
  aspectRatios(props.width ?? 16, props.height ?? 9),
)

// Initialize Bunny players only for iframe mode
onMounted(() => {
  if (!isBare.value && props.mediaEmbed && !isProcessing.value) {
    initializePlayers()
  }
})
</script>

<template>
  <video
    v-if="isBare && props.mediaEmbed"
    aria-hidden="true"
    class="absolute inset-0 h-full w-full object-cover"
    disablepictureinpicture
    loop
    muted
    playsinline
    :poster="props.src"
    preload="metadata"
  >
    <source :src="props.mediaEmbed" type="video/mp4" />
  </video>

  <div
    v-else-if="props.mediaEmbed"
    :class="['m-auto max-w-6xl', mediaTheme.base, aspectClass]"
  >
    <div
      v-if="isProcessing"
      class="relative flex aspect-[16/9] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-zinc-800"
    >
      <UIcon class="mb-2 size-16 text-white" name="i-heroicons-clock" />
      <span class="text-lg font-semibold text-white">
        Video is Processing...
      </span>
    </div>

    <iframe
      v-else
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      :class="['absolute inset-0 h-full w-full bg-black', theme.media.rounded]"
      :data-mid="props.mid"
      frameborder="0"
      loading="lazy"
      :src="props.mediaEmbed"
      :title="props.title"
    />
  </div>
</template>
