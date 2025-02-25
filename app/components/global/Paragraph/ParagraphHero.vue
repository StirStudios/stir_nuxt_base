<script setup lang="ts">
import type { HeroProps } from '~/types/MediaTypes'

import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { observeVideos } = useIntersectionObserver()
const { isFront } = usePageContext()

const { hero, pageTitle, siteSlogan } = defineProps<{
  hero: HeroProps
  pageTitle: string
  siteSlogan: string
}>()

onMounted(() => {
  observeVideos(0.1) // Trigger when 10% of the element is visible
})

const media = computed(() => hero.media?.[0] || {})
</script>

<template>
  <WrapNone :wrapper="hero.editLink ? 'div' : undefined">
    <EditLink :link="hero.editLink" />
    <section
      :class="[
        appConfig.stirTheme.hero.overlay,
        isFront
          ? appConfig.stirTheme.hero.isFront
          : appConfig.stirTheme.hero.base,
      ]"
    >
      >
      <div
        class="z-10 max-w-2xl"
        :class="
          isFront
          ? appConfig.stirTheme.hero.text.isFront
          : appConfig.stirTheme.hero.text.base,
        "
      >
        <WrapAnimate
          :aos="hero?.direction"
          :wrapper="hero?.animate === true ? 'div' : undefined"
        >
          <template v-if="pageTitle && isFront">
            <h1 class="sr-only">{{ pageTitle }}</h1>
            <h2 class="display-h1 text-left">{{ siteSlogan }}</h2>
          </template>
          <h1 v-else-if="pageTitle" class="mb-0 text-white">
            {{ pageTitle }}
          </h1>
          <div v-if="hero.text" class="hero-copy prose" v-html="hero.text" />
        </WrapAnimate>
      </div>
      <img
        v-if="media.type === 'image'"
        :alt="media.alt || ''"
        class="absolute min-h-full w-auto max-w-none min-w-full"
        :height="media.height || ''"
        :sizes="media.sizes || ''"
        :src="media.src || ''"
        :srcset="media.srcset || ''"
        :width="media.width || ''"
      />
      <video
        v-else-if="media.type === 'video'"
        class="absolute min-h-full w-auto max-w-none min-w-full"
        height="640"
        muted
        preload="metadata"
        width="360"
        playsinline
        disablepictureinpicture
        loop
      >
        <source :src="media.mediaEmbed" type="video/mp4" />
      </video>
    </section>
  </WrapNone>
</template>
