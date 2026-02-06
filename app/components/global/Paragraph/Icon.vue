<script setup lang="ts">
defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  align?: string
  iconName?: string
  size?: number | string

  editLink?: string
}>()
</script>

<template>
  <EditLink :link="editLink">
    <WrapAlign :align="align">
      <UIcon
        v-if="iconName"
        :class="[
          'text-primary inline-block',
          size ? `size-${size}` : undefined,
        ]"
        :name="iconName"
      />
    </WrapAlign>
  </EditLink>
</template>
