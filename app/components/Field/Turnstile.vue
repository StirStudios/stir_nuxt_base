<script setup lang="ts">
const turnstileToken = defineModel<string>()

const { turnstile: themeTurnstile = {} } = useAppConfig().stirTheme

const hasLabel = computed(() => Boolean(themeTurnstile.label))
</script>

<template>
  <UFormField
    :label="hasLabel ? themeTurnstile.label : undefined"
    :ui="{
      label:
        themeTurnstile.appearance !== 'interaction-only' && themeTurnstile.label
          ? ''
          : 'sr-only',
    }"
  >
    <NuxtTurnstile
      v-model="turnstileToken"
      class="max-w-xs overflow-x-hidden"
      :options="{ appearance: themeTurnstile.appearance, size: 'flexible' }"
    />
  </UFormField>
</template>
