<script setup lang="ts">
import { provide } from 'vue'
import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const props = defineProps<{
  text?: string
  editLink?: string
  direction?: string
  siteSlogan?: string
}>()

const slots = defineSlots<{ media?(): unknown; button?(): unknown }>()

const { observeVideos } = useIntersectionObserver()
const { isFront, pageTitle, pageHide } = usePageContext()
const { hero: heroTheme } = useAppConfig().stirTheme

onMounted(() => observeVideos(0.1))

// Expose "hero media context" to descendants (like MediaImage)
provide('heroNoWrapper', true)

// Visibility + hero/media detection
const hideHeroSection = computed(() => pageHide.value && !isFront.value)
const hasMediaSlot = computed(() => !!slots.media)
const hasHero = computed(() => !!props.text || hasMediaSlot.value)

const sectionClasses = computed(() => {
  const hasHeroContent = hasHero.value

  return [
    heroTheme.base,
    hideHeroSection.value
      ? `${heroTheme.hide} sr-hide`
      : hasMediaSlot.value
        ? heroTheme.mediaSpacing
        : hasHeroContent
          ? [heroTheme.mediaSpacing, heroTheme.noMediaFallback]
          : heroTheme.noMediaSpacing,
    hasMediaSlot.value && heroTheme.overlay,
    isFront.value && heroTheme.isFront,
    hasMediaSlot.value && 'min-h-[75vh]',
  ]
    .flat()
    .filter(Boolean)
})
</script>

<template>
  <EditLink :link="props.editLink">
    <section :class="sectionClasses">
      <div :class="[heroTheme.text.base, isFront && heroTheme.text.isFront]">
        <WrapAnimate :effect="props.direction">
          <HeroContent
            v-if="props.text"
            :hero-text="props.text"
            :is-front="isFront"
            :page-title="pageTitle"
            :site-slogan="props.siteSlogan"
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

          <slot name="button" />
        </WrapAnimate>
      </div>

      <!-- Plain slot, no scoped props – CE renderer still works -->
      <slot name="media" />
    </section>
  </EditLink>
</template>
