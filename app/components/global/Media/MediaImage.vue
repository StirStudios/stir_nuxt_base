<script setup lang="ts">
import { computed, inject } from 'vue'

const props = defineProps<{
  title?: string
  alt?: string
  src?: string
  srcset?: string
  sizes?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'auto'
  platform?: string
  link?: string
  credit?: string
  noWrapper?: boolean
}>()

const theme = useAppConfig().stirTheme
const isEager = computed(() => props.loading === 'eager')

// 👇 This will be true when rendered inside Hero
const heroNoWrapper = inject<boolean>('heroNoWrapper', false)

// Single source of truth: should we skip the wrapper?
const isBare = computed(() => heroNoWrapper || props.noWrapper === true)
</script>

<template>
  <!-- ==========================================================
       BARE MODE (no outer wrapper – e.g. Hero background)
  ========================================================== -->
  <img
    v-if="isBare"
    :alt="props.alt || ''"
    :class="theme.hero.image.base"
    :fetchpriority="props.fetchpriority || undefined"
    :height="props.height"
    :loading="props.loading || 'lazy'"
    :sizes="props.sizes || '100vw'"
    :src="props.src"
    :srcset="props.srcset"
    :width="props.width"
  />

  <!-- ==========================================================
       WRAPPED MODE (card/gallery usage: overlay, credit, etc.)
  ========================================================== -->
  <component
    :is="props.link ? 'a' : 'div'"
    v-else
    v-bind="
      props.link
        ? {
            href: props.link,
            target: '_blank',
            rel: 'noopener',
            'aria-label': props.alt,
          }
        : {}
    "
    :class="[
      'media group @container relative block overflow-hidden',
      theme.media.rounded,
    ]"
  >
    <!-- Lazy load path with skeleton -->
    <ClientOnly v-if="!isEager" fallback-tag="div">
      <template #default>
        <img
          :alt="props.alt || ''"
          :class="[
            theme.media.base,
            props.platform === 'instagram' ? 'aspect-3/4' : '',
            props.link
              ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
              : '',
          ]"
          :height="props.height"
          :loading="props.loading || 'lazy'"
          :sizes="props.sizes || '100vw'"
          :src="props.src"
          :srcset="props.srcset"
          :width="props.width"
        />
      </template>
      <template #fallback>
        <USkeleton class="aspect-[4/3] max-h-[30%] w-full" />
      </template>
    </ClientOnly>

    <!-- Eager version (Hero / priority / above-the-fold) -->
    <img
      v-else
      :alt="props.alt || ''"
      :class="[
        theme.media.base,
        props.link
          ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
          : '',
      ]"
      fetchpriority="high"
      :height="props.height"
      loading="eager"
      :sizes="props.sizes || '100vw'"
      :src="props.src"
      :srcset="props.srcset"
      :width="props.width"
    />

    <!-- Overlays -->
    <ClientOnly>
      <!-- Instagram caption overlay -->
      <div
        v-if="props.platform === 'instagram'"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 px-4 text-center text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div class="line-clamp-5 max-w-full leading-relaxed break-words">
          {{ props.title }}
        </div>
        <UButton
          v-if="props.link"
          class="mt-5"
          size="sm"
          :to="props.link"
          variant="outline"
        >
          View on Instagram
        </UButton>
      </div>

      <!-- Photo credit overlay -->
      <span
        v-else-if="props.credit"
        class="absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2"
      >
        {{ props.credit }}
      </span>
    </ClientOnly>
  </component>
</template>
