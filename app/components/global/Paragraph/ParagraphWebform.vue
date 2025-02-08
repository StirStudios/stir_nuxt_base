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

// Build Yup schema without dot notation issues
function buildNestedYupSchema(fields: Record<string, any>): ObjectSchema {
  const shape: Record<string, any> = {}

  for (const [key, field] of Object.entries(fields)) {
    if (field['#type'] === 'webform_section') {
      shape[key] = buildNestedYupSchema(field)
    } else {
      shape[key] = field['#required']
        ? field['#type'] === 'email'
          ? string().email('Invalid email').required('This field is required')
          : string().required('This field is required')
        : string().nullable()
    }
  }

  return object().shape(shape)
}

const schema = buildNestedYupSchema(fields)

function initializeFormState(
  fields: Record<string, any>,
  stateObj: Record<string, any> = {},
) {
  for (const [key, field] of Object.entries(fields)) {
    const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()

    if (field['#type'] === 'webform_section') {
      initializeFormState(field, stateObj) // Continue with nested sections
    } else {
      stateObj[snakeCaseKey] = field['#default'] || ''
    }
  }
  return stateObj
}

function transformToFlatSnakeCasePayload(
  obj: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {}

  function flatten(obj: any, parentKey = '') {
    for (const [key, value] of Object.entries(obj)) {
      const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()

      // Skip metadata fields
      if (key.startsWith('#')) continue

      const finalKey = parentKey ? `${parentKey}_${snakeCaseKey}` : snakeCaseKey

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, '') // Flatten without propagating prefixes
      } else {
        result[finalKey] = value
      }
    }
  }

  flatten(obj)
  return result
}

onMounted(async () => {
  const { csrfToken: token } = await $fetch<{ csrfToken: string }>(
    '/api/getCsrfToken',
  )
  csrfToken.value = token
  Object.assign(state, initializeFormState(fields))
})

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  errors.value = {}

  try {
    await schema.validate(state, { abortEarly: false })

    const transformedState = transformToFlatSnakeCasePayload(state)

    const payload = {
      webform_id: webformId,
      ...transformedState,
    }

    await $fetch(`${siteApi}/api/stir_webform_rest/submit`, {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken.value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    toast.add({
      title: 'Success!',
      description: 'Form submitted successfully!',
      color: 'success',
    })
    isFormSubmitted.value = true
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        errors.value[err.path] = err.message
      })
    } else {
      console.error('Validation error:', validationError)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <WrapNone :wrapper="webformSubmissions ? 'div' : undefined">
    <UForm
      v-if="!isFormSubmitted"
      :state="state"
      :schema="schema"
      class="mx-auto space-y-8 md:max-w-lg"
      @submit="onSubmit"
    >
      <template v-for="(field, fieldName) in fields" :key="fieldName">
        <FieldRenderer
          :field="field"
          :fieldName="fieldName"
          :state="state"
          :errors="errors"
        />
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
      <h3 class="text-xl font-bold">Thank You!</h3>
      <div class="webform-response" v-html="webformConfirmation" />
    </div>
  </WrapNone>
</template>
