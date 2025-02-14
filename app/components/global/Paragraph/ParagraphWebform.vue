<script setup lang="ts">
import { evaluateVisibility } from '~/utils/evaluateVisibility'
import { transformPayloadToSnakeCase } from '~/utils/transformPayload'
import { buildYupSchema } from '~/utils/buildYupSchema'
import { useScroll } from '~/composables/useScroll'
import { useValidation } from '~/composables/useValidation'

const props = withDefaults(
  defineProps<{
    webform: WebformDefinition
  }>(),
  {
    webform: {} as WebformDefinition,
  },
)

const { onError } = useValidation()
const { scrollToTop } = useScroll()
const toast = useToast()
const config = useRuntimeConfig()
const appConfig = useAppConfig()
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

// Initialize state and Yup schema
const schema = computed(() => buildYupSchema(fields, state))

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

// Initialize state with `originalKey`
onMounted(() => {
  for (const [key, field] of Object.entries(fields)) {
    if (field['#composite']) {
      if (!state[key] || typeof state[key] !== 'object') {
        state[key] = {} // Ensure composite field is an object
      }

      for (const subKey in field['#composite']) {
        state[key][subKey] =
          state[key][subKey] || field['#composite'][subKey]['value'] || ''
      }
    } else {
      state[key] = field['#default'] || ''
    }
  }
})

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

    const payload = {
      webform_id: webformId,
      turnstile_token: turnstileToken.value || '',
      ...transformPayloadToSnakeCase(state),
    }

    const { data: submitData, error: submitError } = await $fetch(
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

    scrollToTop()

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

function isContainerVisible(containerName: string): boolean {
  const groupFields = getGroupFields(containerName)

  // Check if any field in the container is visible
  return groupFields.some((fieldName) =>
    evaluateVisibility(fields[fieldName]?.['#states'] || {}, state),
  )
}
</script>

<template>
  <WrapNone :wrapper="webformSubmissions ? 'div' : undefined">
    <EditLink :link="webformSubmissions" />
    <UForm
      v-if="!isFormSubmitted"
      :state="state"
      :schema="schema"
      :class="appConfig.stirTheme.webform.form"
      @submit="onSubmit"
      @error="onError"
    >
      <template
        v-for="(fieldName, index) in orderedFieldNames"
        :key="fieldName"
      >
        <template
          v-if="
            shouldRenderGroupContainer(fieldName) &&
            isContainerVisible(fields[fieldName]?.parent)
          "
        >
          <h2 :class="appConfig.stirTheme.webform.fieldGroupHeader">
            {{ fields[fieldName]?.parent }}
          </h2>
          <div :class="appConfig.stirTheme.webform.fieldGroup">
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

    <div v-else :class="appConfig.stirTheme.webform.response">
      <div class="webform-response" v-html="webformConfirmation" />
    </div>
  </WrapNone>
</template>
