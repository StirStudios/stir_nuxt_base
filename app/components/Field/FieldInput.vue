<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
  floatingLabel?: boolean
}>()
</script>

<template>
  <UInput
    :id="fieldName"
    v-model="state[fieldName]"
    class="w-full"
    :placeholder="floatingLabel ? ' ' : ''"
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
