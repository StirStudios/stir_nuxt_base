<script setup lang="ts">
const turnstileToken = defineModel<string>()

const config = useRuntimeConfig()
const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const showContainer = computed(() => !config.public.turnstileDisable)

const showLabel = computed(
  () =>
    themeTurnstile.label && themeTurnstile.appearance !== 'interaction-only',
)
</script>

<template>
  <div v-if="showContainer">
    <p v-if="showLabel" class="text-muted mb-2 text-sm">
      {{ themeTurnstile.label }}
    </p>
    <NuxtTurnstile
      v-model="turnstileToken"
      :options="{ appearance: themeTurnstile.appearance }"
    />
  </div>
</template>
