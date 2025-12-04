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
  const rawMenu = await fetchMenu('account');
  accountMenu.value = Array.isArray(rawMenu.value)
    ? rawMenu.value.map((item) => ({
        label: item.title,
        to: item.relative || item.url,
        icon: getIconForLabel(item.title),
      }))
    : [];
});

const taskItems = computed(() => [localTaskLinks.value]);

const cmsLink = computed(() => [
  {
    label: 'Drupal CMS',
    icon: 'i-lucide-home',
    to: `${drupalBaseUrl}/admin/content`,
    target: '_self',
  },
]);
</script>

<template>
  <LazyUHeader
    v-if="!isAdministrator"
    :ui="{
      root: 'sticky top-0 z-60 w-full px-4 py-1 backdrop-blur shadow',
    }"
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
        :items="[
          [
            {
              label: user?.name || 'Account',
              icon: 'i-lucide-user',
              children: accountMenu,
            },
          ],
        ]"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>

    <template #body>
      <LazyUNavigationMenu
        :items="taskItems"
        :ui="{
          link: 'text-xs text-default',
          linkLeadingIcon: 'text-default',
        }"
      />
    </template>
  </LazyUHeader>
</template>
