# Nuxtjs + Drupal Admin Layer

A Nuxt layer that ships Drupal-aware navigation primitives (including `DrupalTabs`) backed by `nuxtjs-drupal-ce` and Nuxt UI.
You can use it directly from this repository (as a Nuxt layer path) or install it as an npm/git dependency that you extend from
your own Nuxt app.

## Installation

Add the layer to your project as a git dependency so the bundled Nuxt UI and Tailwind
packages are resolved from the layer:

```json
{
  "dependencies": {
    "@stir/admin": "github:StirStudios/nuxtjs-drupal-stir#release/nuxtjs-drupal-stir-admin"
  }
}
```

Then extend the layer in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    'github:StirStudios/nuxtjs-drupal-stir#release/nuxtjs-drupal-stir-admin',
  ],
});
```

This layer bundles its own UI and Tailwind dependencies so you can extend it without
installing anything extra in the host project. The layer resolves `@nuxt/ui` from its
own dependency tree, which avoids "Could not load @nuxt/ui" errors when used from a
parent app. Ensure your app is on Nuxt `^4.2.1` or newer so it can resolve the layer's
modules correctly.

## Provided APIs

- `app/components/Drupal/DrupalTabs.vue`: auto-imported navigation tabs powered by Nuxt UI's `UNavigationMenu`.
- `app/composables/useDrupalCe.ts`: re-export of `nuxtjs-drupal-ce` composables so you can call
  `useDrupalCe().fetchMenu('account')` inside the component or your own code.

### Expected page payload

`DrupalTabs` relies on the Drupal CE payload structure. Ensure your rendered page data provides:

- `local_tasks.primary` and `local_tasks.secondary` arrays for contextual tabs.
- `current_user.name` (and optional `current_user.roles`).
- An account menu available via `useDrupalCe().fetchMenu('account')`.

## Using with Drupal CE scaffolding

When initializing a Nuxt app with `nuxtjs-drupal-ce`, scaffold the starter files and remove
the default `app.vue` so the layer can supply its own layout:

```bash
rm -f app.vue && npx nuxt-drupal-ce-init
```

After scaffolding, delete the local `<DrupalTabs />` component reference and rely on the
lazy-loaded version from this layer in your default layout:

```vue
<template>
  <div>
    <LazyDrupalTabs />
    <header>
      <SiteLanguageSwitcher v-if="useNuxtApp().$i18n" />
      <NavigationMain />
    </header>
    <SiteMessages />
    <main id="main">
      <slot />
    </main>
    <footer>
      <NavigationAccount />
    </footer>
  </div>
</template>

<style>
#main {
  min-height: 70vh;
}
body {
  background-color: white;
}
</style>
```

## Playground

A Nuxt playground is included under `playground/` for quick testing of the layer in
isolation. Install dependencies and run `pnpm dev` (or your preferred package manager)
from that directory to experiment with the admin menu and tabs locally.
