<script setup lang="ts">
import type { UserProps } from '~/types/UserProps'
import type { TabsProps } from '~/types/NavigationTypes'

const props = defineProps<{
  user: UserProps
  tabs: TabsProps
}>()

const config = useRuntimeConfig()
const siteApi = config.public.api

const { fetchMenu } = useDrupalCe()
const accountMenu = ref([])

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
  return props.tabs.primary.map((tab) => ({
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

  const localTaskLinks = props.tabs.primary?.length ? [getLocalTaskLinks()] : []

  const accountDropdown = [
    {
      label: props.user?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ]

  return [...baseLinks, ...localTaskLinks, accountDropdown]
})
</script>

<template>
  <UNavigationMenu
    aria-label="Admin navigation"
    role="navigation"
    :items="links"
    :ui="{
      root: 'dark:bg-neutral-000 sticky top-0 z-50 h-[3.1rem] w-full bg-neutral-200 dark:bg-neutral-900 px-4 shadow',
      link: 'text-xs text-black dark:text-white',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-black dark:text-white',
    }"
    content-orientation="vertical"
  />
</template>
