<script setup lang="ts">
const props = defineProps<{
  field: Record<string, unknown>
  fieldName: string
  state: Record<string, Record<string, string>>
  floatingLabel?: boolean
}>()

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

// Ensure composite fields exist before accessing
const compositeFields = computed(() => {
  return typeof props.field?.['#composite'] === 'object'
    ? props.field['#composite']
    : {}
})

// Ensure country options exist before accessing
const countryOptions = computed(() => {
  return compositeFields.value.country?.options
    ? Object.entries(compositeFields.value.country.options).map(
        ([key, label]) => ({ value: key, label }),
      )
    : []
})

// Determine if floating labels should be used (configurable per field)
const useFloatingLabels = computed(
  () =>
    props.field['#floating_label'] !== undefined
      ? props.field['#floating_label'] // Per-field setting
      : webform.labels.floating, // Global default
)

// Ensure state[fieldName] is initialized before access
if (!props.state[props.fieldName]) {
  props.state[props.fieldName] = {}
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField
      v-for="(fieldData, key) in compositeFields"
      :key="key"
      :label="!useFloatingLabels ? fieldData.label : ''"
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
            {{ fieldData.label }}
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
