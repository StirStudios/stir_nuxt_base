<script setup lang="ts">
import { object, string, ObjectSchema } from 'yup'

const props = withDefaults(
  defineProps<{
    webform: WebformDefinition
  }>(),
  {
    webform: {} as WebformDefinition,
  },
)

const toast = useToast()
const config = useRuntimeConfig()
const siteApi = config.public.api

const {
  fields = {},
  webformId = '',
  webformSubmissions = '',
  webformConfirmation = '',
  actions = [],
} = props.webform

const csrfToken = ref('')
const turnstileToken = ref('')
const state = reactive({})
const isFormSubmitted = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const submitButtonLabel = actions[0]?.['#submit_Label'] || 'Submit'

// Maintain API order using Object.keys
const orderedFieldNames = computed(() => Object.keys(fields))

// Dynamically track grouped fields without manual clearing
const groupedFields = computed(() => {
  const grouped: Record<string, string[]> = {}

  orderedFieldNames.value.forEach((fieldName) => {
    const parent = fields[fieldName]?.parent
    if (parent) {
      if (!grouped[parent]) grouped[parent] = []
      grouped[parent].push(fieldName)
    }
  })

  return grouped
})

// Initialize state and Yup schema
const schema = computed(() => buildYupSchema(fields))

function transformPayloadToSnakeCase(
  payload: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(payload)) {
    result[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value
  }
  return result
}

function formatGroupName(groupName: string): string {
  return groupName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

onMounted(() => {
  for (const [key, field] of Object.entries(fields)) {
    state[key] = field['#default'] || ''
  }
})

// Build Yup schema for validation
function buildYupSchema(fields: Record<string, any>): ObjectSchema {
  const shape: Record<string, any> = {}
  for (const [key, field] of Object.entries(fields)) {
    const requiredError = field['#requiredError'] || 'This field is required'
    shape[key] = field['#required']
      ? field['#type'] === 'email'
        ? string().email('Invalid email').required(requiredError)
        : string().required(requiredError)
      : string().nullable()
  }
  return object().shape(shape)
}

function shouldRenderGroupContainer(fieldName: string) {
  return (
    fields[fieldName]?.parent &&
    groupedFields.value[fields[fieldName]?.parent]?.[0] === fieldName
  )
}

function getGroupFields(parentName: string) {
  return groupedFields.value[parentName] || []
}

function shouldRenderIndividualField(fieldName: string) {
  return !fields[fieldName]?.parent
}

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  errors.value = {}

  try {
    if (!config.public.turnstileDisable && !turnstileToken.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'error',
      })
      return
    }

    const { csrfToken: token } = await $fetch<{ csrfToken: string }>(
      '/api/getCsrfToken',
    )
    csrfToken.value = token

    await schema.value.validate(state, { abortEarly: false })

    const payload = {
      webform_id: webformId,
      turnstile_token: turnstileToken.value || '',
      ...transformPayloadToSnakeCase(state),
    }

    const { data: submitData, error: submitError } = await useFetch(
      `${siteApi}/api/stir_webform_rest/submit`,
      {
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    if (submitError?.value) {
      toast.add({
        title: 'Error',
        description: `Error submitting form: ${submitError.value}`,
        color: 'error',
      })
      return
    }

    toast.add({
      title: 'Success!',
      description: 'Form submitted successfully!',
      color: 'success',
    })

    for (const field in state) {
      state[field] = ''
    }
    turnstileToken.value = ''
    isFormSubmitted.value = true
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        errors.value[err.path] = err.message
      })
    } else {
      toast.add({
        title: 'Validation Error',
        description: validationError.message || 'Unknown validation error',
        color: 'error',
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <WrapNone :wrapper="webformSubmissions ? 'div' : undefined">
    <EditLink :link="webformSubmissions" />
    <UForm
      v-if="!isFormSubmitted"
      :state="state"
      :schema="schema"
      class="mx-auto space-y-8 md:max-w-lg"
      @submit="onSubmit"
    >
      <template
        v-for="(fieldName, index) in orderedFieldNames"
        :key="fieldName"
      >
        <template v-if="shouldRenderGroupContainer(fieldName)">
          <h2 class="mb-2 text-xl font-semibold">
            {{ formatGroupName(fields[fieldName]?.parent) }}
          </h2>
          <div class="ms-5 space-y-4">
            <template
              v-for="groupedFieldName in getGroupFields(
                fields[fieldName]?.parent,
              )"
              :key="groupedFieldName"
            >
              <FieldRenderer
                :field="fields[groupedFieldName]"
                :fieldName="groupedFieldName"
                :state="state"
              />
            </template>
          </div>
        </template>

        <template v-else-if="shouldRenderIndividualField(fieldName)">
          <FieldRenderer
            :field="fields[fieldName]"
            :fieldName="fieldName"
            :state="state"
          />
        </template>
      </template>

      <div v-if="!config.public.turnstileDisable">
        <p class="mb-2 text-sm font-medium">Let us know you’re human</p>
        <NuxtTurnstile
          v-model="turnstileToken"
          sitekey="your-turnstile-site-key"
        />
      </div>

      <UButton
        :label="submitButtonLabel"
        :loading="isLoading"
        size="lg"
        type="submit"
      />
    </UForm>

    <div v-else class="text-center">
      <div class="webform-response" v-html="webformConfirmation" />
    </div>
  </WrapNone>
</template>
