<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const props = withDefaults(defineProps<AosProps>(), {
  effect: 'fade-up',
  animate: false,
  stagger: 0.5,
})

const motionEffect = getMotionEffect(props.effect)
</script>

<template>
  <motion.div
    v-if="animate"
    :initial="motionEffect.initial"
    :whileInView="motionEffect.whileInView"
    :transition="{
      ...motionEffect.transition,
      stagger: stagger ? stagger : undefined,
    }"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
