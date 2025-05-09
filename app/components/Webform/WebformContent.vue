<script setup lang="ts">
import type { ObjectSchema } from 'yup'

defineProps<{
  fields: Record<string, WebformFieldProps>
  state: WebformState
  schema: ObjectSchema<Record<string, unknown>>
  isFormSubmitted: boolean
  isLoading: boolean
  orderedFieldNames: string[]
  themeWebform: Record<string, string>
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
    :schema="schema"
    :state="state"
    @submit="emit('submit', $event)"
    @error="emit('error', $event)"
    :class="
      themeWebform.variant === 'material'
        ? themeWebform.spacingLarge
        : themeWebform.spacing
    "
  >
    <div
      class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-12"
    >
      <div class="lg:col-span-8">
        <template
          v-for="(parent, i) in Object.keys(groupedFields)"
          :key="parent"
        >
          <div class="relative py-20">
            <div
              class="absolute inset-y-0 -left-[100vw] -z-10 w-[300vw]"
              :class="i % 2 === 0 ? 'bg-zinc-100' : 'bg-white'"
            />

            <h2 :class="themeWebform.fieldGroupHeader">
              {{ fields[groupedFields[parent][0]]?.parentTitle }}
            </h2>

            <div
              v-if="fields[groupedFields[parent][0]]?.parentDescription"
              class="section-desc"
              v-html="fields[groupedFields[parent][0]]?.parentDescription"
            />

            <div :class="themeWebform.fieldGroup">
              <template
                v-for="fieldName in groupedFields[parent]"
                :key="fieldName"
              >
                <FieldRenderer
                  v-if="
                    !fields[fieldName]?.['#tabGroup'] ||
                    groupedFields[parent]?.find(
                      (f) =>
                        fields[f]?.['#tabGroup'] ===
                        fields[fieldName]?.['#tabGroup'],
                    ) === fieldName
                  "
                  :field="fields[fieldName]"
                  :field-name="fieldName"
                  :fields="fields"
                  :ordered-field-names="orderedFieldNames"
                  :state="state"
                />
              </template>
            </div>
          </div>
        </template>

        <template v-for="fieldName in orderedFieldNames" :key="fieldName">
          <template v-if="shouldRenderIndividualField(fieldName)">
            <FieldRenderer
              :field="fields[fieldName]"
              :field-name="fieldName"
              :fields="fields"
              :ordered-field-names="orderedFieldNames"
              :state="state"
            />
          </template>
        </template>

        <FieldTurnstile
          :model-value="turnstileToken"
          @update:model-value="emit('update:turnstileToken', $event)"
        />
      </div>

      <div class="relative lg:col-span-4">
        <div
          class="fixed inset-x-0 top-auto bottom-0 m-auto max-w-xs pt-20 lg:sticky lg:top-0 lg:bottom-auto lg:max-w-sm"
        >
          <ClientOnly>
            <div
              class="rounded-xl border border-zinc-200 bg-white pb-4 text-sm shadow-sm"
            >
              <WebformCalculator />
              <WrapAlign :align="themeWebform.submitAlign">
                <UButton
                  :label="submitButtonLabel"
                  :loading="isLoading"
                  type="submit"
                />
              </WrapAlign>
            </div>

            <template #fallback>
              <div
                class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <USkeleton class="mb-2 h-5 w-1/2" />
                <USkeleton class="mb-2 h-5 w-full" />
                <USkeleton class="mb-4 h-5 w-3/4" />
                <USkeleton class="mx-auto h-10 w-24" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </UForm>

  <div
    v-else
    :class="`${themeWebform.response} prose`"
    v-html="webformConfirmation"
  />
</template>
