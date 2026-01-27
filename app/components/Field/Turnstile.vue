<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
const turnstileToken = defineModel<string>()

const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const isInteractionOnly = computed(
  () => themeTurnstile.appearance === 'interaction-only',
)

const turnstileWrap = ref<HTMLElement | null>(null)
const hasVisibleWidget = ref(false)
let observedIframe: HTMLIFrameElement | null = null

const showLabel = computed(() => {
  if (!themeTurnstile.label) {
    return false
  }

  if (!isInteractionOnly.value) {
    return true
  }

  return hasVisibleWidget.value
})

const updateVisibility = () => {
  if (!observedIframe) {
    hasVisibleWidget.value = false
    return
  }

  const { height, width } = observedIframe.getBoundingClientRect()
  hasVisibleWidget.value = height > 0 && width > 0
}

const attachIframe = () => {
  if (!turnstileWrap.value) {
    return
  }

  const root =
    // NuxtTurnstile is a component, so ref may be a component instance.
    (turnstileWrap.value as unknown as { $el?: HTMLElement })?.$el ??
    turnstileWrap.value

  if (!root || typeof root.querySelector !== 'function') {
    return
  }

  observedIframe = root.querySelector('iframe')
}

const { isSupported: isMutationSupported } = useMutationObserver(
  turnstileWrap,
  () => {
    attachIframe()
    updateVisibility()
  },
  {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  },
)

watchEffect(() => {
  if (!isInteractionOnly.value || !isMutationSupported.value) {
    hasVisibleWidget.value = false
    observedIframe = null
    return
  }

  attachIframe()
  updateVisibility()
})

const spacingClass = computed(() =>
  isInteractionOnly.value && !hasVisibleWidget.value
    ? 'mb-0'
    : 'max-w-xs overflow-x-hidden',
)
</script>

<template>
  <p v-if="showLabel" class="text-muted mb-2 text-sm">
    {{ themeTurnstile.label }}
  </p>
  <NuxtTurnstile
    ref="turnstileWrap"
    v-model="turnstileToken"
    :class="spacingClass"
    :options="{ appearance: themeTurnstile.appearance, size: 'flexible' }"
  />
</template>
