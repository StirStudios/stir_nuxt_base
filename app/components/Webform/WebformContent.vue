<script setup lang="ts">
defineProps<{
  fields: Record<string, any>
  state: Record<string, any>
  schema: any
  isFormSubmitted: boolean
  isLoading: boolean
  orderedFieldNames: string[]
  themeWebform: any
  groupedFields: Record<string, string[]>
  shouldRenderGroupContainer: (fieldName: string) => boolean
  shouldRenderIndividualField: (fieldName: string) => boolean
  getGroupFields: (parentName: string) => string[]
  isContainerVisible: (containerName: string) => boolean
  submitButtonLabel: string
  webformConfirmation: string
  turnstileToken: string
}>()

const emit = defineEmits<{
  (e: 'submit', event: FormSubmitEvent): void
  (e: 'error', event: unknown): void
  (e: 'update:turnstileToken', value: string): void
}>()
</script>

<template>
  <UForm
    v-if="!isFormSubmitted"
    :class="
      themeWebform.variant === 'material'
        ? themeWebform.spacingLarge
        : themeWebform.spacing
    "
    :schema="schema"
    :state="state"
    @error="emit('error', $event)"
    @submit="emit('submit', $event)"
  >
    <template v-for="fieldName in orderedFieldNames" :key="fieldName">
      <template
        v-if="
          shouldRenderGroupContainer(fieldName) &&
          isContainerVisible(fields[fieldName]?.parent)
        "
      >
        <h2 :class="themeWebform.fieldGroupHeader">
          {{ fields[fieldName]?.parentTitle }}
        </h2>
        <div
          v-if="fields[fieldName]?.parentDescription"
          class="section-desc"
          v-html="fields[fieldName]?.parentDescription"
        />
        <div :class="themeWebform.fieldGroup">
          <template
            v-for="groupedFieldName in getGroupFields(
              fields[fieldName]?.parent,
            )"
            :key="groupedFieldName"
          >
            <FieldRenderer
              :field="fields[groupedFieldName]"
              :field-name="groupedFieldName"
              :state="state"
            />
          </template>
        </div>
      </template>

      <template v-else-if="shouldRenderIndividualField(fieldName)">
        <FieldRenderer
          :field="fields[fieldName]"
          :field-name="fieldName"
          :state="state"
        />
      </template>
    </template>

    <FieldTurnstile
      :model-value="turnstileToken"
      @update:model-value="emit('update:turnstileToken', $event)"
    />

    <WrapAlign :align="themeWebform.submitAlign">
      <UButton :label="submitButtonLabel" :loading="isLoading" type="submit" />
    </WrapAlign>
  </UForm>

  <div
    v-else
    :class="`${themeWebform.response} prose`"
    v-html="webformConfirmation"
  />
</template>
