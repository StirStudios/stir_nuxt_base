<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const theme = useAppConfig().stirTheme

const currentYear = new Date().getFullYear()
const iconsSocialConfig = theme.socials || []
</script>

<template>
  <UFooter
    aria-label="Site Footer"
    :ui="{
      root: theme.footer.base,
      container: `${theme.container} text-center`,
      left: theme.footer.left,
      right: theme.footer.right,
    }"
  >
    <LazyRegionArea area="footer" />

    <template #left>
      <LazyAppLogo
        v-if="theme.navigation.logo"
        :add-classes="theme.navigation.logoScrolledSize"
      />
      <template v-else>
        {{ page?.site_info?.name }}
      </template>
    </template>

    <div class="center">
      <UNavigationMenu
        v-if="page.footer_menu?.length"
        class="mb-3"
        data-nav="Footer Navigation"
        :items="
          page.footer_menu.map((item) => ({
            label: item.title,
            to: item.url,
          }))
        "
        :ui="{
          list: 'flex flex-wrap justify-center',
          item: 'min-w-0 py-0',
          link: theme.footer.footerLinks,
        }"
        variant="link"
      />

      <p class="mb-0">
        © {{ page.site_info?.name }} {{ currentYear }}. All Rights Reserved.<br />
        <template v-if="theme.footer.rights">
          {{ theme.footer.rights }}<br />
        </template>
        <template v-if="theme.footer.poweredby">
          Website created & powered by
          <ULink
            :inactive-class="theme.footer.footerLinks"
            raw
            target="_blank"
            to="//www.stirstudiosdesign.com"
          >
            StirStudios
          </ULink>
        </template>
      </p>
    </div>

    <template #right>
      <div class="flex gap-1">
        <IconsSocial
          v-for="(icon, index) in iconsSocialConfig"
          :key="index"
          v-bind="icon"
          class="me-1"
        />
      </div>

      <ULink
        v-if="!theme.footer.hideEmail"
        :inactive-class="theme.footer.footerLinks"
        raw
        target="_blank"
        :to="`mailto:${page.site_info?.mail}`"
      >
        {{ page.site_info?.mail }}
      </ULink>
    </template>
  </UFooter>
</template>
