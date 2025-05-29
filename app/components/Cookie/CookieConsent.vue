<script setup lang="ts">
const { cookieConsent: config } = useAppConfig()
const route = useRoute()
const open = ref(false)

const consent = useCookie<boolean>('cookie_consent', {
  maxAge: 60 * 60 * 24 * 365,
})

function accept() {
  consent.value = true
  open.value = false
}

watch(
  () => route.path,
  () => {
    if (!import.meta.client) return

    const isBot = /bot|crawl|spider/i.test(navigator.userAgent)

    if (
      !consent.value &&
      config?.enabled &&
      !isBot &&
      ![config.termsUrl, config.privacyUrl].includes(route.path)
    ) {
      open.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <UDrawer
    v-model:open="open"
    :dismissible="false"
    :handle="false"
    :modal="false"
    :overlay="false"
    side="bottom"
    :ui="{
      container:
        'w-full flex flex-col gap-4 p-6 overflow-y-auto max-w-lg mx-auto',
      body: 'text-center text-xs',
    }"
  >
    <template #body>
      <p>{{ config.message }}</p>

      <p v-if="config.termsUrl || config.privacyUrl" class="mt-4">
        {{ config.messageLinks }}
        <ULink
          v-if="config.termsUrl"
          class="underline"
          target="_blank"
          :to="config.termsUrl"
        >
          Terms of Service
        </ULink>
        and
        <ULink
          v-if="config.privacyUrl"
          class="underline"
          target="_blank"
          :to="config.privacyUrl"
        >
          Privacy Policy </ULink
        >.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-center px-6 pb-4">
        <UButton :label="config.buttonLabel" size="xs" @click="accept" />
      </div>
    </template>
  </UDrawer>
</template>
