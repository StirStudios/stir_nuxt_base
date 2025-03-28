<script setup lang="ts">
import type { HeroProps } from '~/types/MediaTypes'

import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const appConfig = useAppConfig()
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
  <EditLink :link="item.editLink">
    <section
      :class="[
        appConfig.stirTheme.hero.overlay,
        isFront
          ? appConfig.stirTheme.hero.isFront
          : appConfig.stirTheme.hero.base,
      ]"
    >
      <div
        :class="[
          appConfig.stirTheme.hero.text.base,
          isFront ? appConfig.stirTheme.hero.text.isFront : '',
        ]"
      >
        <WrapAnimate :effect="item?.direction">
          <HeroContent
            :page-title="pageTitle"
            :site-slogan="siteSlogan"
            :hero-text="hero?.text"
            :is-front="isFront"
          />
        </WrapAnimate>
      </div>
      <img
        v-if="media.type === 'image'"
        :alt="media.alt || ''"
        :class="[
          appConfig.stirTheme.hero.image.base,
          isFront ? appConfig.stirTheme.hero.image.isFront : 'max-w-none',
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
  </EditLink>
</template>
