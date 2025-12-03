<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe();
const drupalBaseUrl = getDrupalBaseUrl();
const page = getPage();

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

onMounted(async () => {
  try {
    const rawMenu = await fetchMenu('account');

    accountMenu.value = Array.isArray(rawMenu.value)
      ? rawMenu.value.map((item) => ({
          label: item.title,
          to: item.relative || item.url,
          icon: getIconForLabel(item.title),
        }))
      : [];
  } catch (err) {
    console.error('Failed to fetch account menu:', err);
  }
});

const mode = useColorMode();

const toggleColorMode = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
};

const colorModeItem = computed(() => [
  {
    label: mode.value === 'dark' ? 'Light mode' : 'Dark mode',
    icon: mode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
    onSelect: toggleColorMode,
    class: 'aria-label:block [&>*:nth-child(2)]:hidden',
  },
]);

const links = computed(() => {
  const base = [
    [
      {
        label: 'Drupal CMS',
        icon: 'i-lucide-home',
        to: `${drupalBaseUrl}/admin/content`,
        target: '_self',
      },
    ],
  ];

  const tasks = localTaskLinks.value.length ? [localTaskLinks.value] : [];

  const modeGroup = [
    ...colorModeItem.value, // <-- icon-only mode switcher
  ];

  const dropdown = [
    {
      label: user.value?.name || 'Account',
      icon: 'i-lucide-user',
      children: [...accountMenu.value, { type: 'label', label: 'Preferences' }],
    },
  ];

  return [...base, ...tasks, modeGroup, dropdown];
});
</script>

<template>
  <UNavigationMenu
    v-if="!isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-elevated px-4 py-1 shadow',
      link: 'text-xs',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-white',
    }"
  />
</template>
