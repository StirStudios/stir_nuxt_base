<script setup lang="ts">
import type { HeroProps } from '~/types/MediaTypes'
import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'
import { useNavLock } from '~/composables/useNavLock'

const { observeVideos } = useIntersectionObserver()
const { isFront } = usePageContext()
const { locked } = useNavLock()

const { hero, pageTitle, siteSlogan, hide } = defineProps<{
  hero?: HeroProps
  pageTitle: string
  siteSlogan: string
  hide: boolean | string
}>()

const { hero: heroTheme } = useAppConfig().stirTheme

onMounted(() => observeVideos(0.1))

// one snapshot object
const snap = reactive({
  isFront: isFront.value,
  title: pageTitle,
  slogan: siteSlogan,
})

// refresh snapshot only after navigation finishes
watch(locked, (l) => {
  if (!l) {
    snap.isFront = isFront.value
    snap.title = pageTitle
    snap.slogan = siteSlogan
  }
})

// effective values (3 short lines)
const isFrontEffective = computed(() =>
  locked.value ? snap.isFront : isFront.value,
)
const pageTitleEffective = computed(() =>
  locked.value ? snap.title : pageTitle,
)
const siteSloganEffective = computed(() =>
  locked.value ? snap.slogan : siteSlogan,
)

const media = computed(() => hero?.media?.[0] || {})
const hasHero = computed(() => !!hero?.text || !!media.value?.type)
const isHidden = computed(() => ['true', '1', true, 1].includes(hide))

const sectionClasses = computed(() => [
  heroTheme.base,
  media.value?.type ? heroTheme.mediaSpacing : heroTheme.noMediaSpacing,
  media.value?.type && heroTheme.overlay,
  isFrontEffective.value && heroTheme.isFront,
  isHidden.value && 'sr-only',
  media.value?.type === 'video' && 'min-h-[75vh]',
])

const getPosterFromSrcset = (srcset: string, targetWidth = '1920w') => {
  return (
    srcset
      .split(',')
      .map((item) => item.trim())
      .find((item) => item.endsWith(targetWidth))
      ?.split(' ')[0] || ''
  )
}

const posterImage = computed(() => {
  const srcset = media.value?.srcset
  return typeof srcset === 'string' ? getPosterFromSrcset(srcset, '1920w') : ''
})
</script>

<template>
  <EditLink :link="hero?.editLink">
    <section :class="sectionClasses">
      <div
        :class="[
          heroTheme.text.base,
          isFrontEffective && heroTheme.text.isFront,
        ]"
      >
        <WrapAnimate :effect="hero?.direction">
          <HeroContent
            v-if="hasHero"
            :hero-text="hero?.text"
            :is-front="isFrontEffective"
            :page-title="pageTitleEffective"
            :site-slogan="siteSloganEffective"
          />
          <h1
            v-else
            :class="[
              isFrontEffective ? heroTheme.text?.isFront : heroTheme.text?.h1,
              heroTheme.text?.container,
            ]"
          >
            {{ pageTitleEffective }}
          </h1>
          <ParagraphButton v-if="hero?.button" :item="hero?.button?.[0]" />
        </WrapAnimate>
      </div>

      <img
        v-if="media.type === 'image'"
        :alt="media.alt || ''"
        :class="[
          heroTheme.image.base,
          isFrontEffective ? heroTheme.image.isFront : 'max-w-none',
        ]"
        :fetchpriority="media.loading === 'eager' ? 'high' : undefined"
        :height="media.height || ''"
        :loading="media.loading || 'lazy'"
        :sizes="media.sizes || ''"
        :src="media.src || ''"
        :srcset="media.srcset || ''"
        :width="media.width || ''"
      />

      <video
        v-else-if="media.type === 'video'"
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover"
        disablepictureinpicture
        height="640"
        loop
        muted
        playsinline
        :poster="posterImage"
        preload="metadata"
        type="video/mp4"
        width="360"
      >
        <source :src="media.mediaEmbed" type="video/mp4" />
      </video>
    </section>
  </EditLink>
</template>
