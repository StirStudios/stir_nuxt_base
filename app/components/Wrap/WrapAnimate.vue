<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const appConfig = useAppConfig()

const props = withDefaults(defineProps<AosProps>(), {
  effect: 'fade-up',
})

const motionEffects = getMotionEffect(props.effect)
</script>

<template>
  <motion.div
    v-if="effect"
    :variants="motionEffects"
    initial="hidden"
    whileInView="show"
    :inViewOptions="{ once: appConfig.stirTheme.animations.once }"
    class="media"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
