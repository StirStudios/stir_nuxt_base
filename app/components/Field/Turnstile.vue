<script setup lang="ts">
const turnstileToken = defineModel<string>()

const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const showLabel = computed(
  () =>
    themeTurnstile.label && themeTurnstile.appearance !== 'interaction-only',
)
</script>

<template>
  <p v-if="showLabel" class="text-muted mb-2 text-sm">
    {{ themeTurnstile.label }}
  </p>
  <NuxtTurnstile
    v-model="turnstileToken"
    :options="{ appearance: themeTurnstile.appearance }"
  />
</template>
