<script setup lang="ts">
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'

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

const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)

const shuffledSlots = computed(() => tk.shuffledSlots(props.randomize))
</script>

<template>
  <EditLink :link="props.editLink">
    <section :class="[props.classes || 'content', props.spacing]">
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
        <template v-for="[slotName] in shuffledSlots" :key="slotName">
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

      <CardGradient v-if="props.card" :layout="props" />
    </section>
  </EditLink>
</template>
