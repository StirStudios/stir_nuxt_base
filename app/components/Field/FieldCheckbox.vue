<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'
import { useEvaluateState } from '~/composables/useEvaluateState'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, boolean | string>
}>()

const descriptionContent = shallowRef<string>('')
const checkboxValue = ref<boolean>(props.field['#defaultValue'] ?? false)
const optionProps = props.field['#optionProperties'] || {}

// Reactive states from the composable
const { checked } = useEvaluateState(props.field['#states'] ?? {}, props.state)

onMounted(() => {
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = checkboxValue.value
  }
})

const syncWithChecked = () => {
  if (!checked.value) {
    checkboxValue.value = false
  }
}

effect(() => {
  syncWithChecked()
  props.state[props.fieldName] = checkboxValue.value
})

const handleModelUpdate = (val: boolean) => {
  checkboxValue.value = val
  props.state[props.fieldName] = val
}
</script>

<template>
  <UCheckbox
    v-model="checkboxValue"
    class="form-input w-full"
    :disabled="!checked"
    :label="field['#title']"
    :ui="{
      label: descriptionContent ? 'sr-only' : '',
    }"
    @update:model-value="handleModelUpdate"
  >
    <template #label>
      <span>{{ field['#title'] }}</span>
      <span v-if="optionProps.description">{{ optionProps.description }}</span>
      <span v-if="optionProps.price" class="extra">
        ${{ optionProps.price.toLocaleString() }}
      </span>
    </template>

    <template #description>
      <span v-html="descriptionContent" />
    </template>
  </UCheckbox>
</template>
