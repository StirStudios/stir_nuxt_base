<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const config = useRuntimeConfig()
const siteApi = config.public.api

const { fetchMenu } = useDrupalCe()
const accountMenu = ref([])

const user = computed(() => page.value?.current_user)
const tabs = computed(() => page.value?.local_tasks)

function getIconForLabel(label: string): string | null {
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
    'My account': 'i-heroicons-user-circle',
  }

  return iconMap[label] || null
}

// Load account menu items and dynamically assign icons
async function loadAccountMenu() {
  try {
    const menuResponse = await fetchMenu('account')
    const menuItems = Array.isArray(menuResponse?._value)
      ? menuResponse._value
      : []

    accountMenu.value = menuItems.map((item) => ({
      label: item.title,
      to: item.relative || item.url,
      icon: getIconForLabel(item.title),
    }))
  } catch (error) {
    console.error('Error fetching account menu:', error)
  }
}

await loadAccountMenu()

// Map tabs to navigation links and assign icons
const getLocalTaskLinks = () => {
  return tabs.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  }))
}

// Dynamically compute navigation links
const links = computed(() => {
  const baseLinks = [
    [
      {
        label: 'Drupal CMS',
        icon: getIconForLabel('Drupal CMS'),
        to: `${siteApi}/admin/content`,
      },
    ],
  ]

  const localTaskLinks = tabs.primary?.length ? [getLocalTaskLinks()] : []

  const accountDropdown = [
    {
      label: user?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ]

  return [...baseLinks, ...localTaskLinks, accountDropdown]
})
</script>

<template>
  <UNavigationMenu
    :items="links"
    :ui="{
      root: 'sticky top-0 z-50 h-[3.1rem] w-full bg-neutral-200 dark:bg-neutral-900 p-4 shadow',
      link: 'text-xs text-black dark:text-white',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-black dark:text-white',
    }"
    content-orientation="vertical"
  />
</template>
