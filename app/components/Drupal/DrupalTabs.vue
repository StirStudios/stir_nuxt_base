<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe();
const drupalBaseUrl = getDrupalBaseUrl();
const page = getPage();

// ----------------------------------------------
// User + admin
// ----------------------------------------------
const user = computed(() => page.value?.current_user || null);
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
);

// ----------------------------------------------
// Icon mapping
// ----------------------------------------------
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

// ----------------------------------------------
// Local tasks (primary tabs)
// ----------------------------------------------
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

// ----------------------------------------------
// Account dropdown menu
// ----------------------------------------------
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

// ----------------------------------------------
// Navigation items for LOCAL TASKS
// ----------------------------------------------
const taskItems = computed(() => [localTaskLinks.value]);

// ----------------------------------------------
// Drupal CMS link
// ----------------------------------------------
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
  <!-- =========================================================
       HEADER LAYOUT (this is what fixes literally everything)
       ========================================================= -->
  <UHeader v-if="!isAdministrator">
    <!-- LEFT: Drupal CMS link -->
    <template #left>
      <UNavigationMenu :items="[cmsLink]" orientation="horizontal" />
    </template>

    <!-- CENTER: Local task primary menu -->
    <template #default>
      <UNavigationMenu
        :items="taskItems"
        orientation="horizontal"
        highlight
        highlight-color="primary"
        class="hidden md:flex"
        :ui="{
          linkLabel: 'text-sm',
          linkLeadingIcon: 'text-white',
        }"
      />
    </template>

    <!-- RIGHT: color mode button + account dropdown -->
    <template #right>
      <ClientOnly>
        <UColorModeButton size="sm" class="mr-1" :ui="{ icon: 'text-white' }">
          <template #fallback>
            <UButton loading variant="ghost" color="neutral" />
          </template>
        </UColorModeButton>
      </ClientOnly>

      <UNavigationMenu
        :items="[
          [
            {
              label: user?.name || 'Account',
              icon: 'i-lucide-user',
              children: accountMenu,
            },
          ],
        ]"
        orientation="horizontal"
        :ui="{
          linkLabel: 'text-sm',
          linkLeadingIcon: 'text-white',
        }"
      />
    </template>
  </UHeader>
</template>
