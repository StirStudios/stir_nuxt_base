<script setup lang="ts">
const appConfig = useAppConfig()

defineProps<{
  header?: string
  classes?: string
}>()
</script>

<template>
  <template v-if="classes">
    <h2 v-if="header" class="mb-10 text-center">{{ header }}</h2>
    <div :class="`matrix ${classes}`">
      <slot />
    </div>
  </template>
  <slot v-else />
</template>
