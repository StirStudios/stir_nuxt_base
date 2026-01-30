<script setup lang="ts">
defineProps<{
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
