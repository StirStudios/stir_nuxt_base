<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';

const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe();

const page = getPage();
const drupalBaseUrl = getDrupalBaseUrl();

const user = computed(() => page.value?.current_user || null);
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
);

const getIconForLabel = (label: string): string | null => {
  const map: Record<string, string> = {
    'Drupal CMS': 'i-lucide-home',
    Settings: 'i-lucide-settings',
    View: 'i-lucide-eye',
    Edit: 'i-lucide-pencil',
    Delete: 'i-lucide-trash-2',
    Revisions: 'i-lucide-copy',
    Export: 'i-lucide-upload',
    API: 'i-lucide-code',
    'Log out': 'i-lucide-log-out',
    'Log in': 'i-lucide-log-in',
    'My account': 'i-lucide-user',
  };
  return map[label] || null;
};

const tabs = computed(
  () => page.value?.local_tasks ?? { primary: [], secondary: [] },
);

const localTaskLinks = computed(() =>
  tabs.value.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  })),
);

const accountMenu = ref([]);

try {
  const rawMenu = await fetchMenu('account');

  accountMenu.value = Array.isArray(rawMenu.value)
    ? rawMenu.value.map((i) => ({
        label: i.title,
        to: i.relative || i.url,
        icon: getIconForLabel(i.title),
      }))
    : [];
} catch (e) {
  console.error('Failed to fetch account menu:', e);
}

const links = computed(() => {
  const cmsLink = [
    [
      {
        label: 'Drupal CMS',
        icon: getIconForLabel('Drupal CMS'),
        to: `${drupalBaseUrl}/admin/content`,
        target: '_self',
      },
    ],
  ];

  const tasks = localTaskLinks.value.length ? [localTaskLinks.value] : [];

  const accountDropdown = [
    {
      label: user.value?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ];

  return [...cmsLink, ...tasks, accountDropdown];
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMdUp = breakpoints.greaterOrEqual('md');

const isCollapsed = computed(() => !isMdUp.value);
</script>

<template>
  <UNavigationMenu
    v-if="isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    tooltip
    :collapsed="isCollapsed"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-accented p-4 shadow',
      link: 'text-xs text-default',
      linkLeadingIcon: 'text-default',
    }"
  />
</template>
