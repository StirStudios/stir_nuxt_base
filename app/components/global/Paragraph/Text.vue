<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  text?: string
  align?: string
  width?: string
  spacing?: string
  classes?: string
  direction?: string
  editLink?: string
}>()
</script>

<template>
  <EditLink :link="props.editLink">
    <WrapAnimate :effect="props.direction">
      <WrapAlign :align="props.align">
        <div
          :class="[
            [props.classes, 'prose'].filter(Boolean).join(' '),
            props.width,
            props.spacing,
          ]"
          v-html="props.text"
        />
      </WrapAlign>
    </WrapAnimate>
  </EditLink>
</template>
