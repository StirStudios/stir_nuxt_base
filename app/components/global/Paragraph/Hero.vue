<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'

const props = defineProps<{
  mode?: 'full' | 'simple'
  text?: string
  editLink?: string
  direction?: string
  siteSlogan?: string
  classes?: string
}>()

defineSlots<{
  header?(): unknown
  media?(): unknown
  footer?(): unknown
  button?(): unknown
  title?(): unknown
}>()

const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)

const { observeVideos } = useIntersectionObserver()
const { isFront, pageTitle, pageHide } = usePageContext()
const { hero: heroTheme } = useAppConfig().stirTheme

// Only needed in FULL mode
if (props.mode !== 'simple') {
  onMounted(() => observeVideos(0.1))
  provide('isHero', true)
}

const hideHeroSection = computed(
  () => props.mode !== 'simple' && pageHide.value && !isFront.value,
)
const hasMediaSlot = computed(() => tk.slot('media').length > 0)
const hasHero = computed(() => !!props.text || hasMediaSlot.value)

const sectionClasses = computed(() => {
  if (props.mode === 'simple') {
    return props.classes || ''
  }

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
    <template v-if="props.mode === 'simple'">
      <slot name="header" />
      <slot name="media" />
      <slot name="footer" />
    </template>

    <template v-else>
      <section :class="sectionClasses">
        <div :class="[heroTheme.text.base, isFront && heroTheme.text.isFront]">
          <WrapAnimate :effect="props.direction">
            <slot name="title">
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
            </slot>

            <slot name="button" />
          </WrapAnimate>
        </div>

        <slot name="media" />
      </section>
    </template>
  </EditLink>
</template>
