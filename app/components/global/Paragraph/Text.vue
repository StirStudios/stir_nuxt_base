<script setup lang="ts">
defineProps<{
  // Identity
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  // Content
  text?: string

  // Layout
  align?: string
  width?: string
  spacing?: string
  classes?: string
  direction?: string

  // Meta
  editLink?: string
}>()
</script>

<template>
  <EditLink :link="editLink">
    <WrapAnimate :effect="direction">
      <WrapAlign :align="align">
        <div
          :class="[
            [classes, 'prose'].filter(Boolean).join(' '),
            width,
            spacing,
          ]"
          v-html="text"
        />
      </WrapAlign>
    </WrapAnimate>
  </EditLink>
</template>
