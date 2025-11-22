<script setup lang="ts">
import { slugify } from '~/utils/stringUtils'

const props = defineProps<{
  id?: number | string
  uuid?: string
  layout?: string
  label?: string
  header?: string
  headerTag?: string
  width?: string
  spacing?: string
  container?: boolean
  card?: boolean
  gridClass?: string
  randomize?: boolean
  classes?: string
}>()

const vueSlots = useSlots()

const orderedSlots = computed(() => Object.entries(vueSlots))

const sectionId = computed(() => {
  if (props.label) return slugify(props.label)
  return `section-${props.id ?? 'unknown'}`
})
</script>

<template>
  <section :id="sectionId" :class="[props.classes || 'content', props.spacing]">
    <component :is="props.headerTag || 'h2'" v-if="props.header">
      {{ props.header }}
    </component>

    <Grid
      :card="props.card"
      :container="props.container"
      :grid-items="props.gridClass"
      :spacing="props.spacing"
      :width="props.width"
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
