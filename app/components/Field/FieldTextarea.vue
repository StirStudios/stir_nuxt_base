<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
  floatingLabel?: boolean
}>()
</script>

<template>
  <UTextarea
    v-model="state[fieldName]"
    class="w-full"
    placeholder=""
    :id="fieldName"
    :ui="floatingLabel ? { base: 'peer' } : {}"
  >
    <label
      v-if="floatingLabel"
      :for="fieldName"
      class="pointer-events-none absolute -top-1.5 left-0 px-1.5 text-xs font-medium text-(--ui-text-highlighted) transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-(--ui-text-dimmed) peer-focus:-top-1.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-(--ui-text-highlighted)"
    >
      <span class="inline-flex bg-(--ui-bg) px-1">
        {{ field['#title'] }}
      </span>
    </label>
  </UTextarea>
</template>
