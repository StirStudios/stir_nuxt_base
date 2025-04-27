<script setup lang="ts">
import type { HeroProps } from '~/types/MediaTypes'

import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { observeVideos } = useIntersectionObserver()
const { isFront } = usePageContext()

const { hero, pageTitle, siteSlogan } = defineProps<{
  hero?: HeroProps
  pageTitle: string
  siteSlogan: string
}>()

const { hero: heroTheme } = useAppConfig().stirTheme

onMounted(() => {
  observeVideos(0.1)
})

const sectionClasses = computed(() => [
  heroTheme.base,
  media.value?.type ? heroTheme.mediaSpacing : heroTheme.noMediaSpacing,
  media.value?.type && heroTheme.overlay,
  isFront.value && heroTheme.isFront,
])

const media = computed(() => hero?.media?.[0] || {})
const hasHero = computed(() => !!hero?.text || !!media.value?.type)
</script>

<template>
  <EditLink :link="hero?.editLink">
    <section :class="sectionClasses">
      <div :class="isFront ? heroTheme.text.isFront : heroTheme.text.base">
        <WrapAnimate :effect="hero?.direction">
          <HeroContent
            v-if="hasHero"
            :hero-text="hero?.text"
            :is-front="isFront"
            :page-title="pageTitle"
            :site-slogan="siteSlogan"
          />
          <h1
            v-else
            :class="[
              isFront ? heroTheme.text?.isFront : heroTheme.text?.h1,
              heroTheme.text?.container,
            ]"
          >
            {{ pageTitle }}
          </h1>
        </WrapAnimate>
      </div>

      <img
        v-if="media.type === 'image'"
        :alt="media.alt || ''"
        :class="[
          heroTheme.image.base,
          isFront ? heroTheme.image.isFront : 'max-w-none',
        ]"
        :height="media.height || ''"
        :sizes="media.sizes || ''"
        :src="media.src || ''"
        :srcset="media.srcset || ''"
        :width="media.width || ''"
      />

      <video
        v-else-if="media.type === 'video'"
        class="absolute min-h-full w-auto max-w-none min-w-full"
        disablepictureinpicture
        height="640"
        loop
        muted
        playsinline
        preload="metadata"
        type="video/mp4"
        width="360"
      >
        <source :src="media.mediaEmbed" type="video/mp4" />
      </video>
    </section>
  </EditLink>
</template>
