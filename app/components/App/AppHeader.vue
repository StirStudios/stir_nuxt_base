<script lang="ts" setup>
import { useScrollNav } from '~/composables/useScrollNav'
import { usePageContext } from '~/composables/usePageContext'

const { scrollDirection, atBottom, isScrolled } = useScrollNav()
const { page, isFront } = usePageContext()
const { fetchMenu } = useDrupalCe()
const route = useRoute()
const appConfig = useAppConfig()
const theme = appConfig.stirTheme

// Fetch menu items
const mainMenu = await fetchMenu('main')
const navLinks = mainMenu.value.map((item) => ({
  label: item.title,
  to: item.external
    ? item.absolute
    : `/${item.alias}${item.options?.fragment ? `#${item.options.fragment}` : ''}`,
}))

const headerRootClasses = computed(() => [
  theme.navigation.base,
  theme.navigation.transparentTop && !finalIsScrolled.value
    ? 'bg-transparent backdrop-none border-none'
    : theme.navigation.background,
  {
    'is-scrolled': finalIsScrolled.value,
    '-translate-y-full':
      (isFront.value && !finalIsScrolled.value && theme.navigation.isHidden) ||
      (finalIsScrolled.value &&
        scrollDirection.value === 'down' &&
        !atBottom.value),
  },
])

// Optional: Override isScrolled on hash load
const forceScrolled = ref(false)
onMounted(() => {
  if (route.hash) forceScrolled.value = true
})
const finalIsScrolled = computed(() => isScrolled.value || forceScrolled.value)
</script>

<template>
  <UHeader
    aria-label="Site header"
    :mode="theme.navigation.toggleType"
    :title="page.site_info?.name"
    :to="'/'"
    :toggle-side="theme.navigation.toggleDirection"
    :ui="{
      root: headerRootClasses,
      container: 'flex-wrap',
      body: theme.navigation.slideover.body,
      right: appConfig.colorMode?.forced
        ? 'block lg:hidden lg:flex-0'
        : 'lg:flex-1',
    }"
  >
    <template #title>
      <AppLogo v-if="theme.navigation.logo" add-classes="w-auto" />
      <template v-else>
        {{ page.site_info?.name }}
      </template>
    </template>

    <UNavigationMenu
      :color="theme.navigation.color"
      :highlight="theme.navigation.highlight.show"
      :highlight-color="
        theme.navigation.highlight.show ? theme.navigation.highlight.color : ''
      "
      :items="navLinks"
      :variant="theme.navigation.variant"
    />

    <template #right>
      <IconsColorMode />
    </template>

    <template #body>
      <UNavigationMenu
        :items="navLinks"
        orientation="vertical"
        :ui="{ link: theme.navigation.slideover.link }"
      />
    </template>
  </UHeader>
</template>
