<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, boolean | string>
}>()

const checkboxValue = ref<boolean>(props.field['#defaultValue'] ?? false)

onMounted(() => {
  // Initialize parent state only if it's empty or undefined
  if (!props.state[props.fieldName]) {
    props.state[props.fieldName] = checkboxValue.value
  }
})
</script>

<template>
  <UCheckbox
    v-model="checkboxValue"
    :label="field['#title']"
    class="w-full"
    @update:model-value="props.state[fieldName] = $event"
  />
</template>
