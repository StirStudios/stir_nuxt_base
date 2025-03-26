<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const props = withDefaults(defineProps<AosProps>(), {
  aos: 'fade-up',
  wrapper: undefined,
})

const motionEffect = getMotionEffect(props.aos)
</script>

<template>
  <motion.div
    v-if="wrapper"
    :initial="motionEffect.initial"
    :whileInView="motionEffect.whileInView"
    :transition="motionEffect.transition"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
