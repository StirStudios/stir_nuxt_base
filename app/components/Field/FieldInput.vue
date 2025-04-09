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
    :id="props.fieldName"
    v-model="props.state[props.fieldName]"
    class="w-full"
    :inputmode="isTel ? 'tel' : undefined"
    :max="isNumber ? props.field['#max'] : undefined"
    :min="isNumber ? props.field['#min'] : undefined"
    :placeholder="props.floatingLabel ? ' ' : ''"
    :step="isNumber ? props.field['#step'] || 1 : undefined"
    :type="props.field['#type'] || 'text'"
    :ui="props.floatingLabel ? { base: 'peer' } : {}"
    :variant="webform.variant"
  >
    <label
      v-if="props.floatingLabel"
      :class="[isMaterial ? '' : 'px-1.5', webform.labels.base]"
      :for="props.fieldName"
    >
      <span :class="[isMaterial ? '' : 'px-1', 'inline-flex bg-(--ui-bg)']">
        {{ props.field['#title'] }}
      </span>
    </label>
  </UInput>
</template>
