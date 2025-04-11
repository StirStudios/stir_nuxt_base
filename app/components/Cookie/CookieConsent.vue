<script setup lang="ts">
const appConfig = useAppConfig().cookieConsent
const route = useRoute()
const visible = ref(false)

const consent = useCookie<boolean>('cookie_consent', {
  default: () => false,
  maxAge: 60 * 60 * 24 * 365,
})

onMounted(() => {
  if (
    !consent.value &&
    appConfig?.enabled &&
    !['/terms', '/privacy'].includes(route.path)
  ) {
    visible.value = true
  }
})

function accept() {
  consent.value = true
  visible.value = false
}
</script>

<template>
  <UModal
    v-model:open="visible"
    :dismissible="false"
    :title="appConfig.title"
    :ui="{
      footer: 'justify-end pb-8',
      title: 'text-base',
      content: 'divide-none',
    }"
  >
    <template #description>
      <p>
        {{ appConfig.message }}
        <ULink target="_blank" :to="appConfig.termsUrl">Terms of Service</ULink>
        and
        <ULink target="_blank" :to="appConfig.privacyUrl">Privacy Policy</ULink
        >.
      </p>
    </template>
    <template #footer>
      <UButton :label="appConfig.buttonText" size="sm" @click="accept" />
    </template>
  </UModal>
</template>
