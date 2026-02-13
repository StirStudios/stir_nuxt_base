<script setup lang="ts">
import type { WebformFieldProps } from '~~/types'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, Record<string, string>>
  floatingLabel?: boolean
}>()

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

const compositeFields = computed<Record<string, WebformFieldProps>>(() =>
  typeof props.field['#composite'] === 'object' &&
  props.field['#composite'] !== null
    ? props.field['#composite']
    : {},
)

const countryOptions = computed(() => {
  const countryField = compositeFields.value.country
  const options =
    countryField && typeof countryField['#options'] === 'object'
      ? countryField['#options']
      : undefined

  return options
    ? Object.entries(options).map(([key, label]) => ({
        value: key,
        label: String(label),
      }))
    : []
})

const useFloatingLabels = computed(
  () =>
    props.field['#floating_label'] !== undefined
      ? props.field['#floating_label']
      : webform.labels.floating,
)

if (!props.state[props.fieldName]) {
  props.state[props.fieldName] = {}
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField
      v-for="(fieldData, key) in compositeFields"
      :key="key"
      :label="!useFloatingLabels ? String(fieldData['#title'] ?? key) : ''"
      :name="`${fieldName}.${key}`"
      :required="!!field['#required']"
    >
      <UInput
        v-if="key !== 'country'"
        v-model="state[fieldName][key]"
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
          <span :class="[isMaterial ? '' : 'px-1', 'bg-default inline-flex']">
            {{ String(fieldData['#title'] ?? key) }}
          </span>
        </label>
      </UInput>

      <USelectMenu
        v-else
        v-model="state[fieldName].country"
        class="w-full"
        :items="countryOptions"
        label-key="label"
        placeholder="Select Country"
        value-key="label"
        :variant="webform.variant"
      />
    </UFormField>
  </div>
</template>
