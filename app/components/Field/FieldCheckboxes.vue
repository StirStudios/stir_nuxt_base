<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const descriptionContent = shallowRef<string>('')

onMounted(() => {
  const value = props.state[props.fieldName]
  if (value === undefined || value === '') {
    props.state[props.fieldName] = []
  }
  descriptionContent.value = cleanHTML(props.field['#description'] || '')
})

const maxSelected = computed(() => props.field['#maxSelected'] ?? Infinity)

const items = computed(() => {
  const options = props.field['#options'] || {}
  const optionProps = props.field['#optionProperties'] || {}

  return Object.entries(options).map(([key, label]) => ({
    label,
    value: key,
    props: optionProps?.[key] || {},
  }))
})

function enforceGroupLimit(val: string[]): string[] {
  const group = props.field['#group']
  const groupLimit = props.field['#groupMaxSelected']

  if (!group || groupLimit !== 1) return val

  for (const [key, _val] of Object.entries(props.state)) {
    const otherField = (
      webformState.fields as Record<string, WebformFieldProps>
    )[key]
    if (
      key !== props.fieldName &&
      otherField?.['#group'] === group &&
      Array.isArray(props.state[key]) &&
      props.state[key].length > 0
    ) {
      props.state[key] = []
    }
  }

  return val
}

// Watch local field and enforce local max
watch(
  () => props.state[props.fieldName],
  (val) => {
    if (Array.isArray(val)) {
      if (val.length > maxSelected.value) {
        props.state[props.fieldName] = val.slice(-maxSelected.value)
      }
    }
  },
)
</script>

<template>
  <UCheckboxGroup
    class="form-input w-full"
    :items="items"
    :model-value="state[fieldName]"
    @update:model-value="
      (val) => {
        state[fieldName] = enforceGroupLimit(val)
      }
    "
  >
    <template #label="{ item }">
      <span>{{ item.label }}</span>
      <span v-if="item.props.description">{{ item.props.description }}</span>
      <span v-if="item.props.price" class="extra">
        ${{ item.props.price.toLocaleString() }}
      </span>
    </template>
  </UCheckboxGroup>
</template>
