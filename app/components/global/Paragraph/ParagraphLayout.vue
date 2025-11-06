<script setup lang="ts">
import { useAppConfig } from '#imports'
import { useShuffledLayouts } from '~/composables/useShuffledLayouts'

// Props from Drupal CE output
const props = defineProps<{
  header?: string
  headerTag?: string
  width?: string
  spacing?: string
  container?: boolean
  card?: boolean
  gridClass?: string
  randomize?: boolean
  classes?: string
  editLink?: string
}>()

// Define Vue slots (actual <slot name="first" /> etc.)
const slots = defineSlots<Record<string, () => unknown>>()

const { container, card } = useAppConfig().stirTheme

// Compute grid + container wrapper classes
const layoutClasses = computed(() =>
  [props.gridClass || 'grid-cols-1', props.container ? container : '']
    .filter(Boolean)
    .join(' '),
)

// Optional shuffle support for slot rendering order
const shuffledSlots = computed(() => {
  const entries = Object.entries(slots)
  if (!props.randomize) return entries
  // Fisher–Yates shuffle for slot order
  const shuffled = [...entries]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
})
</script>

<template>
  <EditLink :link="props.editLink">
    <section
      :class="[
        props.classes || 'content',
        props.spacing,
        props.randomize ? 'randomize' : '',
      ]"
    >
      <component
        :is="props.headerTag || 'h2'"
        v-if="props.header"
        :class="container"
      >
        {{ props.header }}
      </component>

      <div :class="[props.width, layoutClasses, props.card ? card.base : '']">
        <template v-if="slots && Object.keys(slots).length">
          <template v-for="[slotName, slotFn] in shuffledSlots" :key="slotName">
            <div
              :class="[
                'region',
                slotName,
                ['top', 'bottom'].includes(slotName) ? 'col-span-full' : '',
              ]"
            >
              <slot :name="slotName" />
            </div>
          </template>
        </template>

        <CardGradient v-if="props.card" :layout="props" />
      </div>
    </section>
  </EditLink>
</template>
