<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'

withDefaults(defineProps<AosProps>(), {
  aos: 'fade-up',
  wrapper: undefined,
  aosDelay: 0,
})
</script>

<template>
  <component
    :is="wrapper"
    v-if="wrapper"
    :data-aos="aos"
    :data-aos-delay="aosDelay"
    data-aos-once="true"
  >
    <slot />
  </component>
  <slot v-else />
</template>
