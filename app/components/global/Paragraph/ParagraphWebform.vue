<script setup lang="ts">
import type { WebformProps } from '~/types/FormTypes'
import { object, string, type InferType } from 'yup'

const toast = useToast()

const props = defineProps<WebformProps>()

// Reactive state for form data and CSRF token
const formData = reactive<{ [key: string]: string }>({})
const csrfToken = ref('')
const webformId = props.webform[0]?.webformId
const webformSubmissions = props.webform[0]?.webformSubmissions
const config = useRuntimeConfig()
const siteApi = config.public.api
const turnstile = ref()
const isFormSubmitted = ref(false)
const isLoading = ref(false)

// Reactive state for form fields
const state = reactive<{ [key: string]: any }>({})

// Dynamic schema creation based on webform fields
const schema = object(
  Object.keys(props.webform[0].fields).reduce(
    (acc, fieldName) => {
      const field = props.webform[0].fields[fieldName]
      if (field['#type'] === 'email') {
        acc[fieldName] = string()
          .email('Invalid email format')
          .required(field['#requiredError'] || 'Email is required')
          .nullable()
      } else {
        acc[fieldName] = field['#required']
          ? string()
              .required(field['#requiredError'] || 'Required')
              .nullable()
          : string().nullable()
      }
      return acc
    },
    {} as { [key: string]: any },
  ),
)

// Infer the schema type for TypeScript
type Schema = InferType<typeof schema>

// Initialize the state with dynamic fields on mounted
onMounted(async () => {
  try {
    // Fetch the CSRF token
    const { data: csrfData } = await useFetch('/api/token')
    csrfToken.value = csrfData.value?.csrfToken || ''

    // Initialize formData and state for dynamic fields from props
    const fields = props.webform[0]?.fields || {}
    for (const field in fields) {
      formData[field] = ''
      state[field] = '' // Initialize state as well for reactivity
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
  }
})

// Submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    if (!config.public.turnstileDisable && !turnstile.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'error',
      })
      return
    }

    // Populate formData with values from state
    Object.keys(state).forEach((fieldName) => {
      formData[fieldName] = state[fieldName] || ''
    })

    const payload = {
      webform_id: webformId,
      ...formData,
    }

    // Send the form submission
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

    if (submitError.value) {
      toast.add({
        title: 'Error',
        description: 'Error submitting form: ' + submitError.value,
        color: 'error',
      })
      return
    } else {
      toast.add({
        title: 'Success!',
        description:
          'Form submitted successfully!\nThank you for your submission.',
        color: 'success',
      })
    }

    // Clear form state and formData after successful submission
    for (const field in state) {
      state[field] = ''
      formData[field] = ''
    }

    isFormSubmitted.value = true
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Error during submission: ' + error.message,
      color: 'error',
    })
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
      class="mx-auto space-y-4 md:max-w-lg"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
      <!-- Loop through fields -->
      <template
        v-for="(field, fieldName) in props.webform[0].fields"
        :key="fieldName"
      >
        <UFormField
          :label="field['#title']"
          :description="field['#description']"
          :name="fieldName"
          :required="field['#required']"
        >
          <!-- Description -->
          <template v-if="field['#description']" #description>
            <span v-html="field['#description']" />
          </template>
          <!-- Input Types -->
          <UInput
            v-if="['textfield', 'email'].includes(field['#type'])"
            v-model="state[fieldName]"
            :type="field['#type']"
            :placeholder="field['#placeholder']"
            class="w-full"
          />
          <UTextarea
            v-else-if="field['#type'] === 'textarea'"
            v-model="state[fieldName]"
            :placeholder="field['#placeholder']"
            class="w-full"
          />
          <template v-if="field['#help']" #help>
            {{ field['#help'] }}
          </template>
        </UFormField>
      </template>

      <!-- Actions -->
      <template
        v-for="action in props.webform[0].actions"
        :key="action['#type']"
      >
        <p
          class="mb-1 block pb-0 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Let us know you're human
        </p>
        <ClientOnly>
          <NuxtTurnstile v-model="turnstile" />
        </ClientOnly>
        <UButton
          :label="action['#submit_Label']"
          :loading="isLoading"
          size="lg"
          type="submit"
        />
      </template>
    </UForm>

    <!-- Submission Confirmation -->
    <div v-else class="text-center">
      <h3 class="text-xl font-bold">Thank You!</h3>
      <div
        class="webform-response"
        v-html="props.webform[0].webformConfirmation"
      ></div>
    </div>
  </WrapNone>
</template>
