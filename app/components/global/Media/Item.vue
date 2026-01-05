<script setup lang="ts">
interface SlotNode {
  props?: Record<string, unknown>
}

type MediaType = 'image' | 'video' | 'document' | 'audio' | 'link'

interface MediaProps {
  type: MediaType
  credit?: string
  mediaEmbed?: unknown
  [key: string]: unknown
}

interface SlotsToolkit {
  propsOf(node: SlotNode): MediaProps
}

const props = defineProps<{
  node: SlotNode
  index: number
  overlay?: boolean
  tk: SlotsToolkit
}>()

const emit = defineEmits<{
  (e: 'open', index: number): void
}>()

const theme = useAppConfig().stirTheme

const mediaProps = computed(() => props.tk.propsOf(props.node))

const isVideo = computed(() => mediaProps.value.type === 'video')
const isDocument = computed(() => mediaProps.value.type === 'document')
const isAudio = computed(() => mediaProps.value.type === 'audio')

const componentMap: Record<MediaType, Component> = {
  image: resolveComponent('MediaImage'),
  video: resolveComponent('MediaVideo'),
  document: resolveComponent('MediaDocument'),
  audio: resolveComponent('MediaAudio'),
  link: resolveComponent('MediaLink'),
}
</script>

<template>
  <component
    :is="componentMap[mediaProps.type]"
    v-if="!overlay || isDocument || isAudio"
    v-bind="mediaProps"
  />

  <div
    v-else
    class="group relative overflow-hidden"
    :class="[theme.media.rounded, isVideo || overlay ? 'cursor-pointer' : '']"
    @click="emit('open', index)"
  >
    <div
      :class="[
        'transition-transform',
        theme.media.effects.scale,
        theme.media.transitions.slow,
      ]"
    >
      <MediaImage v-bind="{ ...mediaProps, hideCredit: true }" />
    </div>

    <span
      v-if="mediaProps.credit"
      :class="[
        'absolute bottom-0 left-0 w-full bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100',
        theme.media.transitions.fast,
      ]"
    >
      {{ mediaProps.credit }}
    </span>

    <template v-if="isVideo">
      <div
        class="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/10"
      />
      <button
        aria-label="Play Video"
        class="absolute inset-0 z-20 flex items-center justify-center text-white"
      >
        <UIcon name="i-lucide-play-circle" size="60" />
      </button>
    </template>
  </div>
</template>
