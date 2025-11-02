<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const config = useRuntimeConfig()
const siteApi = config.public.api
const { fetchMenu } = useDrupalCe()

const accountMenu = ref([])

const tabs = computed(
  () => page.value?.local_tasks ?? { primary: [], secondary: [] },
)
const user = computed(() => page.value?.current_user)

const getIconForLabel = (label: string): string | null => {
  const iconMap: Record<string, string> = {
    'Drupal CMS': 'i-heroicons-home',
    Settings: 'i-heroicons-cog',
    View: 'i-heroicons-eye',
    Edit: 'i-heroicons-pencil',
    Delete: 'i-heroicons-trash',
    Revisions: 'i-heroicons-document-duplicate',
    Export: 'i-heroicons-arrow-up-tray',
    API: 'i-heroicons-code-bracket',
    'Log out': 'i-heroicons-arrow-left-start-on-rectangle',
    'Log in': 'i-heroicons-arrow-right-start-on-rectangle',
    'My account': 'i-heroicons-user-circle',
  }

  return iconMap[label] || null
}

// Safe, clean async call with fallback
try {
  const rawMenu = await fetchMenu('account')
  accountMenu.value = Array.isArray(rawMenu.value)
    ? rawMenu.value.map((item) => ({
        label: item.title,
        to: item.relative || item.url,
        icon: getIconForLabel(item.title),
      }))
    : []
} catch (e) {
  console.error('Failed to fetch account menu:', e)
}

// Optional: helper to map local tasks
const getLocalTaskLinks = () =>
  tabs.value.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  }))

// Dynamic nav links
const links = computed(() => {
  const baseLinks = [
    [
      {
        label: 'Drupal CMS',
        icon: getIconForLabel('Drupal CMS'),
        to: `${siteApi}/admin/content`,
        target: '_self',
      },
    ],
  ]

  const localTaskLinks = tabs.value.primary?.length ? [getLocalTaskLinks()] : []

  const accountDropdown = [
    {
      label: user.value?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ]

  return [...baseLinks, ...localTaskLinks, accountDropdown]
})
</script>

<template>
  <UNavigationMenu
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-neutral-200 dark:bg-neutral-900 p-4 shadow',
      link: 'text-xs text-black dark:text-white',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-black dark:text-white',
    }"
  />
</template>
