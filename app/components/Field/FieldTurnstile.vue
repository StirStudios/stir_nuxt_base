<script setup lang="ts">
const turnstileToken = defineModel<string>()

const config = useRuntimeConfig()
const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const showContainer = computed(
  () =>
    !config.public.turnstileDisable &&
    themeTurnstile.appearance !== 'interaction-only',
)
</script>

<template>
  <div v-if="showContainer">
    <p class="mb-2 text-sm text-(--ui-text-muted)">
      {{ themeTurnstile.label }}
    </p>
    <NuxtTurnstile
      v-model="turnstileToken"
      :options="{ appearance: themeTurnstile.appearance }"
    />
  </div>
</template>
