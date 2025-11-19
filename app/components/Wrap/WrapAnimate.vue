<script setup lang="ts">
import { getMotionEffect } from '~/utils/animations'
import { motion } from 'motion-v'

const config = useAppConfig()
const animations = computed(() => config.stirTheme.animations.once)

const props = defineProps<{
  effect?: string
  class?: string
}>()

const motionEffects = computed(() => getMotionEffect(props.effect))
</script>

<template>
  <motion.div
    v-if="props.effect"
    :class="props.class"
    v-bind="$attrs"
    :in-view-options="{ once: animations }"
    initial="hidden"
    :variants="motionEffects"
    while-in-view="show"
  >
    <slot />
  </motion.div>

  <div v-else :class="props.class" v-bind="$attrs">
    <slot />
  </div>
</template>
