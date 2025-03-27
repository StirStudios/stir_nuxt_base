<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const appConfig = useAppConfig()

const props = withDefaults(defineProps<AosProps>(), {
  effect: 'fade-up',
  animate: false,
})

const motionEffects = getMotionEffect(props.effect)
</script>

<template>
  <motion.div
    v-if="animate"
    :variants="motionEffects"
    initial="hidden"
    whileInView="show"
    :inViewOptions="{ once: appConfig.stirTheme.animations.once }"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
