<script setup lang="ts">
const props = defineProps<{
  title?: string
  alt?: string
  src?: string
  type?: string
  srcset?: string
  sizes?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'auto'
  platform?: string
  link?: string
  credit?: string
  hideCredit?: boolean
  noWrapper?: boolean
  isHero?: boolean
}>()

const theme = useAppConfig().stirTheme
const isEager = computed(() => props.loading === 'eager')

// Try to get hero context
const injectedIsHero = inject<boolean>('isHero', false)

// Explicit prop OR inherited hero → hero mode
const isHero = computed(() => props.isHero === true || injectedIsHero)

// Bare mode: Hero OR noWrapper
const isBare = computed(() => isHero.value || props.noWrapper === true)
</script>

<template>
  <img
    v-if="isBare"
    :alt="props.alt || ''"
    :class="
      isHero
        ? theme.hero.image.base
        : [
            theme.media.base,
            theme.media.rounded,
            'm-auto max-w-fit !object-contain',
          ]
    "
    :fetchpriority="props.fetchpriority || undefined"
    :height="props.height"
    :loading="props.loading || 'lazy'"
    :sizes="props.sizes || '100vw'"
    :src="props.src"
    :srcset="props.srcset"
    :width="props.width"
  />

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
    <ClientOnly v-if="!isEager" fallback-tag="div">
      <template #default>
        <img
          :alt="props.alt || ''"
          :class="[
            theme.media.base,
            props.platform === 'instagram' ? 'aspect-3/4' : '',
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

    <img
      v-else
      :alt="props.alt || ''"
      :class="[theme.media.base]"
      fetchpriority="high"
      :height="props.height"
      loading="eager"
      :sizes="props.sizes || '100vw'"
      :src="props.src"
      :srcset="props.srcset"
      :width="props.width"
    />

    <ClientOnly>
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

      <span
        v-else-if="props.credit && !props.hideCredit"
        class="absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2"
      >
        {{ props.credit }}
      </span>
    </ClientOnly>
  </component>
</template>
