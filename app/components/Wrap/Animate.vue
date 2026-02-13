<script setup lang="ts">
import {
  createSpringLinearEasing,
  defaultTransitionConfig,
} from '~/utils/animations'

const config = useAppConfig()
const animateOnce = computed(() => config.stirTheme.animations.once !== false)
const props = defineProps<{
  effect?: string
  class?: string
}>()

const root = ref<HTMLElement | null>(null)
const isInView = ref(false)
const hasEntered = ref(false)
const supportsLinearEasing = ref(false)
const springEasing = createSpringLinearEasing(defaultTransitionConfig)
const fallbackEasing = `cubic-bezier(${defaultTransitionConfig.ease.join(', ')})`

const hiddenTransforms: Record<string, string> = {
  'fade-in': 'none',
  'fade-up': 'translateY(100px)',
  'fade-down': 'translateY(-100px)',
  'fade-left': 'translateX(-100px)',
  'fade-right': 'translateX(100px)',
  'flip-up': 'perspective(1000px) rotateX(90deg)',
  'flip-down': 'perspective(1000px) rotateX(-90deg)',
  'flip-left': 'perspective(1000px) rotateY(-90deg)',
  'flip-right': 'perspective(1000px) rotateY(90deg)',
  'slide-up': 'translateY(100px)',
  'slide-down': 'translateY(-100px)',
  'slide-left': 'translateX(-100px)',
  'slide-right': 'translateX(100px)',
  'zoom-in': 'scale(0.8)',
  'zoom-out': 'scale(1.2)',
  'zoom-in-up': 'translateY(100px) scale(0.8)',
  'zoom-in-down': 'translateY(-100px) scale(0.8)',
  'zoom-in-left': 'translateX(-100px) scale(0.8)',
  'zoom-in-right': 'translateX(100px) scale(0.8)',
  'zoom-out-up': 'translateY(100px) scale(1.2)',
  'zoom-out-down': 'translateY(-100px) scale(1.2)',
  'zoom-out-left': 'translateX(-100px) scale(1.2)',
  'zoom-out-right': 'translateX(100px) scale(1.2)',
}

const shouldShow = computed(() => {
  if (!props.effect) return true
  if (animateOnce.value && hasEntered.value) return true
  return isInView.value
})

const transitionTimingFunction = computed(() =>
  supportsLinearEasing.value ? springEasing : fallbackEasing,
)

const animationStyle = computed(() => {
  if (!props.effect) return undefined

  const hiddenTransform = hiddenTransforms[props.effect] ?? hiddenTransforms['fade-in']

  return {
    opacity: shouldShow.value ? '1' : '0',
    transform: shouldShow.value ? 'none' : hiddenTransform,
    transition: `opacity ${defaultTransitionConfig.duration}s ${transitionTimingFunction.value} ${defaultTransitionConfig.delay}s, transform ${defaultTransitionConfig.duration}s ${transitionTimingFunction.value} ${defaultTransitionConfig.delay}s`,
    willChange: 'opacity, transform',
    transformStyle: props.effect?.startsWith('flip-') ? 'preserve-3d' : undefined,
  }
})

onMounted(() => {
  if (!props.effect || !root.value) return

  supportsLinearEasing.value = CSS.supports(
    'transition-timing-function',
    'linear(0, 1)',
  )

  if (!('IntersectionObserver' in window)) {
    isInView.value = true
    hasEntered.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      const visible = Boolean(entry?.isIntersecting)
      isInView.value = visible

      if (visible) {
        hasEntered.value = true
        if (animateOnce.value) observer.disconnect()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
    },
  )

  observer.observe(root.value)

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <div
    v-if="props.effect"
    ref="root"
    :class="props.class"
    :style="animationStyle"
    v-bind="$attrs"
  >
    <slot />
  </div>

  <slot v-else />
</template>
