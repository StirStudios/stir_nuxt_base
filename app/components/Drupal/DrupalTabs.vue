<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe();
const drupalBaseUrl = getDrupalBaseUrl();
const page = getPage();

// -------------------------------------------------------
// User + admin
// -------------------------------------------------------
const user = computed(() => page.value?.current_user || null);
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
);

// -------------------------------------------------------
// Icon map
// -------------------------------------------------------
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

// -------------------------------------------------------
// Local tasks
// -------------------------------------------------------
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

// -------------------------------------------------------
// Account dropdown
// -------------------------------------------------------
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

// -------------------------------------------------------
// Navigation items (WITHOUT account menu)
// -------------------------------------------------------
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

  return [...base, ...tasks];
});

// -------------------------------------------------------
// Client-only color mode switcher
// -------------------------------------------------------
const mode = process.client ? useColorMode() : ref('light');

const toggleColorMode = () => {
  if (!process.client) return;
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
};
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
  >
    <!-- ===============================================
         RIGHT-SIDE: Color Mode Switch + Account Dropdown
         =============================================== -->
    <template #list-trailing>
      <div class="flex items-center gap-2">
        <!-- COLOR MODE SWITCH -->
        <UColorModeSwitch
          size="sm"
          :ui="{
            icon: 'text-white',
            thumb: 'bg-white',
            root: 'cursor-pointer',
          }"
        />

        <!-- ACCOUNT DROPDOWN -->
        <UPopover>
          <button class="flex items-center gap-1 text-white text-xs">
            <UIcon name="i-lucide-user" class="size-5 text-white" />
          </button>

          <template #panel>
            <div class="p-2 space-y-1">
              <ULink
                v-for="item in accountMenu"
                :key="item.label"
                :to="item.to"
                class="flex items-center gap-2 px-2 py-1 text-sm"
              >
                <UIcon :name="item.icon" class="size-4" />
                {{ item.label }}
              </ULink>
            </div>
          </template>
        </UPopover>
      </div>
    </template>
  </UNavigationMenu>
</template>
