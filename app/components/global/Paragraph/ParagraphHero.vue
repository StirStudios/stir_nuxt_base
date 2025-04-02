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

const { hero: heroTheme } = useAppConfig().stirTheme

onMounted(() => {
  observeVideos(0.1) // Trigger when 10% of the element is visible
})

const media = computed(() => hero.media?.[0] || {})
</script>

<template>
  <EditLink :link="hero?.editLink">
    <section
      :class="[heroTheme.overlay, isFront ? heroTheme.isFront : heroTheme.base]"
    >
      <div
        :class="[heroTheme.text.base, isFront ? heroTheme.text.isFront : '']"
      >
        <WrapAnimate :effect="hero?.direction">
          <HeroContent
            :hero-text="hero?.text"
            :is-front="isFront"
            :page-title="pageTitle"
            :site-slogan="siteSlogan"
          />
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
        width="360"
      >
        <source :src="media.mediaEmbed" type="video/mp4" />
      </video>
    </section>
  </EditLink>
</template>
