<script setup lang="ts">
import { slugify } from '~/utils/stringUtils'

const props = defineProps<{
  // Identity
  id?: number | string
  uuid?: string

  // Layout behavior
  layout?: string
  container?: boolean
  card?: boolean

  // Labels / heading
  label?: string
  header?: string
  headerTag?: string

  // Styling / classes
  width?: string
  spacing?: string
  gridClass?: string
  classes?: string

  // Options
  randomize?: boolean
}>()

const vueSlots = useSlots()
const orderedSlots = computed(() => Object.entries(vueSlots))

const sectionId = computed(() => {
  if (props.label) return slugify(props.label)
  return `section-${props.id ?? 'unknown'}`
})
</script>

<template>
  <section :id="sectionId" :class="[classes || 'content', spacing]">
    <component :is="headerTag || 'h2'" v-if="header">
      {{ props.header }}
    </component>

    <Grid
      :card="card"
      :container="container"
      :grid-items="gridClass"
      :spacing="spacing"
      :width="width"
    >
      <template v-for="[slotName] in orderedSlots" :key="slotName">
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
    </Grid>
  </section>
</template>
