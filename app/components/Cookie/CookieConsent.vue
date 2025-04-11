<script setup lang="ts">
const { cookieConsent: config } = useAppConfig()
const route = useRoute()
const visible = ref(false)

const consent = useCookie<boolean>('cookie_consent', {
  default: () => false,
  maxAge: 60 * 60 * 24 * 365,
})

onMounted(() => {
  if (
    !consent.value &&
    config?.enabled &&
    ![config.termsUrl, config.privacyUrl].includes(route.path)
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
    :title="config.title"
    :ui="{
      footer: 'justify-end pb-8',
      title: 'text-base',
      content: 'divide-none',
    }"
  >
    <template #description>
      <p>{{ config.message }}</p>

      <p v-if="config.termsUrl || config.privacyUrl" class="mt-5">
        {{ config.messageLinks }}
        <ULink
          v-if="config.termsUrl"
          class="underline"
          target="_blank"
          :to="config.termsUrl"
        >
          Terms of Service</ULink
        >
        and
        <ULink
          v-if="config.privacyUrl"
          class="underline"
          target="_blank"
          :to="config.privacyUrl"
        >
          Privacy Policy</ULink
        >.
      </p>
    </template>
    <template #footer>
      <UButton :label="config.buttonLabel" size="sm" @click="accept" />
    </template>
  </UModal>
</template>
