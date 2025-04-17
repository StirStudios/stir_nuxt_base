<script setup lang="ts">
const turnstileToken = defineModel<string>()

const config = useRuntimeConfig()
const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const showContainer = computed(() => !config.public.turnstileDisable)
</script>

<template>
  <div v-if="showContainer">
    <p v-if="themeTurnstile.label" class="mb-2 text-sm text-(--ui-text-muted)">
      {{ themeTurnstile.label }}
    </p>
    <NuxtTurnstile
      v-model="turnstileToken"
      :options="{ appearance: themeTurnstile.appearance }"
    />
  </div>
</template>
