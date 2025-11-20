<script setup lang="ts">
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
}>()

const vueSlots = useSlots()

const orderedSlots = computed(() => Object.entries(vueSlots))
</script>

<template>
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

    <CardGradient v-if="props.card" :layout="props" />
  </section>
</template>
