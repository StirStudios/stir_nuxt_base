<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe();
const drupalBaseUrl = getDrupalBaseUrl();
const page = getPage();

// ----------------------------
// User / Admin
// ----------------------------
const user = computed(() => page.value?.current_user || null);
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
);

// ----------------------------
// Icon map
// ----------------------------
const iconFor = (label: string): string | null => {
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

// ----------------------------
// Local tasks (View/Edit/etc)
// ----------------------------
const tabs = computed(() => page.value?.local_tasks ?? { primary: [] });

const taskItems = computed(() =>
  tabs.value.primary.map((t) => ({
    label: t.label,
    to: t.url,
    icon: iconFor(t.label),
  })),
);

// ----------------------------
// Account dropdown
// ----------------------------
const accountMenu = ref([]);

onMounted(async () => {
  const raw = await fetchMenu('account');

  accountMenu.value = Array.isArray(raw.value)
    ? raw.value.map((item) => ({
        label: item.title,
        to: item.relative || item.url,
        icon: iconFor(item.title),
      }))
    : [];
});

// ----------------------------
// Client-only color mode
// ----------------------------
const mode = process.client ? useColorMode() : ref('light');

const toggleColor = () => {
  if (!process.client) return;
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <UDashboardToolbar v-if="!isAdministrator">
    <!-- LEFT: Drupal CMS -->
    <template #left>
      <UNavigationMenu
        :items="[
          [
            {
              label: 'Drupal CMS',
              icon: 'i-lucide-home',
              to: `${drupalBaseUrl}/admin/content`,
              target: '_self',
            },
          ],
        ]"
        highlight
      />
    </template>

    <!-- CENTER: View / Edit / Revisions -->
    <template #default>
      <UNavigationMenu
        v-if="taskItems.length"
        :items="[taskItems]"
        highlight
        class="flex-1"
      />
    </template>

    <!-- RIGHT: Color toggle + Account dropdown -->
    <template #right>
      <!-- COLOR SWITCH -->
      <ClientOnly>
        <UColorModeButton size="sm">
          <template #fallback>
            <UButton loading variant="ghost" color="neutral" />
          </template>
        </UColorModeButton>
      </ClientOnly>

      <!-- ACCOUNT MENU -->
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
        highlight
      />
    </template>
  </UDashboardToolbar>
</template>
