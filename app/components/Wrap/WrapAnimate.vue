<script setup lang="ts">
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const config = useAppConfig()
const animations = computed(() => config.stirTheme.animations.once)

const props = defineProps<{
  effect?: string
}>()

const motionEffects = getMotionEffect(props.effect)
</script>

<template>
  <motion.div
    v-if="effect"
    class="media"
    :in-view-options="{ once: animations }"
    initial="hidden"
    :variants="motionEffects"
    while-in-view="show"
  >
    <slot />
  </motion.div>
  <slot v-else />
</template>
