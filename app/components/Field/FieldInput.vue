<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
  floatingLabel?: boolean
}>()

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

const isNumber = computed(() => props.field['#type'] === 'number')
const isTel = computed(() => props.field['#type'] === 'tel')
</script>

<template>
  <UInput
    :id="fieldName"
    v-model="state[fieldName]"
    class="w-full"
    :inputmode="isTel ? 'tel' : undefined"
    :max="isNumber ? field['#max'] : undefined"
    :min="isNumber ? field['#min'] : undefined"
    :placeholder="floatingLabel ? ' ' : ''"
    :step="isNumber ? field['#step'] || 1 : undefined"
    :type="field['#type'] || 'text'"
    :ui="floatingLabel ? { base: 'peer' } : {}"
    :variant="webform.variant"
  >
    <label
      v-if="floatingLabel"
      :class="[isMaterial ? '' : 'px-1.5', webform.labels.base]"
      :for="fieldName"
    >
      <span :class="[isMaterial ? '' : 'px-1', 'inline-flex bg-(--ui-bg)']">
        {{ field['#title'] }}
      </span>
    </label>
  </UInput>
</template>
