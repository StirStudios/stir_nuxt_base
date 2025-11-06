<script setup lang="ts">
import { useVideoPlayers } from '~/composables/useVideoPlayers'
defineOptions({ inheritAttrs: false })

// Flat CE-style props (not item object)
const props = defineProps<{
  title?: string
  alt?: string
  src?: string
  platform?: string
  width?: number
  height?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  poster?: string
  noWrapper?: boolean
  mediaEmbed?: string
}>()

const theme = useAppConfig().stirTheme
const { media } = theme
const { initializePlayers } = useVideoPlayers()

// Hero context flag
const heroNoWrapper = inject<boolean>('heroNoWrapper', false)
const isBare = computed(() => heroNoWrapper || props.noWrapper === true)

// Handle special cases
const isProcessing = computed(() => props.width === 180)
const isEmbed = computed(() =>
  props.src?.match(/(youtube|vimeo|bunny\.net|player\.vimeo\.com)/i),
)
const videoSrc = computed(() => props.mediaEmbed || props.src)

onMounted(() => {
  if (!isBare.value) initializePlayers()
})
</script>

<template>
  <!-- ==========================================================
       HERO / BARE MODE (autoplay background)
  ========================================================== -->
  <video
    v-if="isBare && videoSrc"
    aria-hidden="true"
    class="absolute inset-0 h-full w-full object-cover"
    disablepictureinpicture
    height="640"
    loop
    muted
    playsinline
    :poster="props.poster"
    preload="metadata"
    width="360"
  >
    <source :src="videoSrc" type="video/mp4" />
  </video>

  <!-- ==========================================================
       PROCESSING PLACEHOLDER
  ========================================================== -->
  <div
    v-else-if="isProcessing"
    class="relative flex aspect-[16/9] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-zinc-800"
  >
    <UIcon class="mb-2 size-16 text-white" name="i-heroicons-clock" />
    <span class="text-lg font-semibold text-white">
      Video is Processing...
    </span>
  </div>

  <!-- ==========================================================
       NORMAL WRAPPED VIDEO (iframe embed or native <video>)
  ========================================================== -->
  <div
    v-else
    :class="[
      'media-video group relative overflow-hidden',
      media.rounded,
      media.base,
    ]"
  >
    <!-- External embeds -->
    <iframe
      v-if="isEmbed"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="absolute inset-0 h-full w-full"
      frameborder="0"
      loading="lazy"
      :src="videoSrc"
      :title="props.title"
    />

    <!-- Direct MP4 video -->
    <video
      v-else
      :autoplay="props.autoplay"
      class="absolute inset-0 h-full w-full object-cover"
      :controls="props.controls ?? true"
      :loop="props.loop"
      :muted="props.muted"
      :poster="props.poster"
      preload="metadata"
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
  </div>
</template>
