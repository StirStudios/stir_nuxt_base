<script setup lang="ts">
import { ref, computed, useScript, useScriptTriggerElement } from '#imports'

const props = defineProps<{
  calendlyUrl: string
  calendlyScheme?: string
  title?: string
}>()

const el = ref<HTMLElement | null>(null)

const trigger = useScriptTriggerElement({
  trigger: 'visible',
  el,
})

useScript('https://assets.calendly.com/assets/external/widget.js', {
  trigger,
})

const elAttrs = computed(() =>
  trigger instanceof Promise ? (trigger.ssrAttrs ?? {}) : {},
)

const colorScheme = computed(() => props.calendlyScheme || 'light')
</script>

<template>
  <div ref="el" v-bind="elAttrs" class="relative">
    <div
      class="calendly-inline-widget"
      :data-url="calendlyUrl"
      :style="`min-width:320px;height:700px;color-scheme:${colorScheme}`"
    />
  </div>
</template>
