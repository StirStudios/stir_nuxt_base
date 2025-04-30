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

// Watch and auto-enforce the maxSelected AFTER user clicks
watch(
  () => props.state[props.fieldName],
  (val) => {
    if (Array.isArray(val) && val.length > maxSelected.value) {
      props.state[props.fieldName] = val.slice(-maxSelected.value)
    }
  },
)
</script>

<template>
  <UCheckboxGroup
    v-model="state[fieldName]"
    class="form-input w-full"
    :items="items"
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
