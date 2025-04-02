<script setup lang="ts">
import type { AosProps } from '~/types/UtilityTypes'
import { getMotionEffect } from '~/utils/animations'
// import { motion } from 'motion-v'

const appConfig = useAppConfig()

const props = defineProps<AosProps>()

const motionEffects = getMotionEffect(props.effect)
</script>

<template>
  <motion.div
    v-if="effect"
    class="media"
    :in-view-options="{ once: appConfig.stirTheme.animations.once }"
    initial="hidden"
    :variants="motionEffects"
    while-in-view="show"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
