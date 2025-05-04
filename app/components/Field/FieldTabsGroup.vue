<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { useTabGroup } from '~/composables/useTabGroup'

import FieldInput from '@/components/Field/FieldInput'
import FieldTextarea from '@/components/Field/FieldTextarea'
import FieldSelect from '@/components/Field/FieldSelect'
import FieldRadio from '@/components/Field/FieldRadio'
import FieldCheckbox from '@/components/Field/FieldCheckbox'
import FieldCheckboxes from '@/components/Field/FieldCheckboxes'
import FieldDate from '@/components/Field/FieldDate'
import FieldDateTime from '@/components/Field/FieldDateTime'
import FieldAddress from '@/components/Field/FieldAddress'
import FieldProcessedText from '@/components/Field/FieldProcessedText'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
  fields: Record<string, WebformFieldProps>
  orderedFieldNames: string[]
}>()

const componentMap: Record<string, Component> = {
  textfield: FieldInput,
  email: FieldInput,
  number: FieldInput,
  tel: FieldInput,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
  checkbox: FieldCheckbox,
  checkboxes: FieldCheckboxes,
  datetime: FieldDateTime,
  date: FieldDate,
  address: FieldAddress,
  processed_text: FieldProcessedText,
}

const { shouldRenderTabs, tabItems, active } = useTabGroup(
  props.field,
  props.fieldName,
  props.fields,
  props.orderedFieldNames,
)
</script>

<template>
  <UTabs
    v-if="shouldRenderTabs && tabItems.length"
    v-model="active"
    class="w-full"
    :content="true"
    :items="tabItems"
    :unmount-on-hide="true"
  >
    <template #content="{ item }">
      <div
        v-if="fields[item.value]?.['#description']"
        class="text-sm text-gray-600"
        v-html="fields[item.value]['#description']"
      />
      <component
        :is="componentMap[fields[item.value]?.['#type']]"
        v-if="componentMap[fields[item.value]?.['#type']]"
        :field="fields[item.value]"
        :field-name="item.value"
        :fields="fields"
        :ordered-field-names="orderedFieldNames"
        :state="state"
      />
      <div
        v-if="fields[item.value]?.['#help']"
        class="text-muted text-xs"
        v-html="fields[item.value]['#help']"
      />
    </template>
  </UTabs>
</template>
