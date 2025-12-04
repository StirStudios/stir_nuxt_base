<script setup lang="ts">
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

// Wrap tasks into NavigationMenu format
const taskItems = computed(() => [localTaskLinks.value]);

const cmsLink = computed(() => [
  {
    label: 'Drupal CMS',
    icon: 'i-lucide-home',
    to: `${drupalBaseUrl}/admin/content`,
    target: '_self',
  },
]);

const accountMenu = ref([]);

onMounted(async () => {
  const rawMenu = await fetchMenu('account');

  accountMenu.value = Array.isArray(rawMenu.value)
    ? rawMenu.value.map((item) => ({
        label: item.title,
        to: item.relative || item.url,
        icon: getIconForLabel(item.title),
      }))
    : [];
});

// Build a clean dropdown group
const accountDropdown = computed(() => [
  {
    label: user.value?.name || 'Account',
    icon: getIconForLabel('My account'),
    children: accountMenu.value,
  },
]);

// Fix: blur active element when slideover opens (prevents aria-hidden focus warning)
const onOpen = (val: boolean) => {
  if (val && import.meta.client) {
    (document.activeElement as HTMLElement | null)?.blur();
  }
};
</script>

<template>
  <LazyUHeader
    v-if="isAdministrator"
    mode="drawer"
    :ui="{
      root: 'sticky top-0 z-60 w-full backdrop-blur shadow bg-accented',
      container: 'max-w-full',
    }"
    @update:open="onOpen"
  >
    <template #left>
      <LazyUNavigationMenu
        :items="[cmsLink]"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>

    <template #default>
      <LazyUNavigationMenu
        :items="taskItems"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>

    <template #right>
      <LazyUColorModeButton size="sm" class="mr-1 text-default">
        <template #fallback>
          <UButton loading variant="ghost" color="neutral" />
        </template>
      </LazyUColorModeButton>

      <LazyUNavigationMenu
        :items="[accountDropdown]"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>

    <template #body>
      <LazyUNavigationMenu
        :items="taskItems"
        orientation="vertical"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>
  </LazyUHeader>
</template>
