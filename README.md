# Drupal Admin Layer

A Nuxt layer that ships Drupal-aware navigation primitives (including `DrupalTabs`) backed by `nuxtjs-drupal-ce` and Nuxt UI.
You can use it directly from this repository (as a Nuxt layer path) or install it as an npm/git dependency that you extend from
your own Nuxt app.

## Installation

Add the layer to your project and extend it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['github:StirStudios/nuxtjs-drupal-stir#release/nuxtjs-drupal-stir-admin'],
})
```

Ensure the host project installs the peer dependencies:

- `nuxt@^4.2.1`
- `@nuxt/ui@^4.2.1`
- `nuxtjs-drupal-ce@^2.5.0-rc.7`

## Provided APIs

- `app/components/Drupal/DrupalTabs.vue`: auto-imported navigation tabs powered by Nuxt UI's `UNavigationMenu`.
- `app/composables/usePageContext.ts`: exposes the current page payload (including `page`, `current_user`, and `local_tasks`).
- `app/composables/useDrupalCe.ts`: re-export of `nuxtjs-drupal-ce` composables so you can call
  `useDrupalCe().fetchMenu('account')` inside the component or your own code.

### Expected page payload

`DrupalTabs` relies on the Drupal CE payload structure. Ensure your rendered page data provides:

- `local_tasks.primary` and `local_tasks.secondary` arrays for contextual tabs.
- `current_user.name` (and optional `current_user.roles`).
- An account menu available via `useDrupalCe().fetchMenu('account')`.
