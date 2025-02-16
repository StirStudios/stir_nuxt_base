# StirStudios Nuxt UI 3 Theme Layer for Lupus Decoupled

This setup provides a boilerplate theme layer for your **Lupus Decoupled** web app or website. Simply install it like any other GitHub repository and take advantage of **Nuxt UI 3** and **Tailwind CSS 4**.

## Project Description

**Lupus Decoupled** has already done the heavy lifting by bridging the gap between **Drupal CMS** and a **Nuxt UI** frontend. This project builds upon that by introducing **admin editing tools** for the frontend along with **theme configuration options**.

---

## Installation

This theme layer can be used independently, but you will need a **Drupal installation** with **Lupus Decoupled** installed. For more details, refer to the official [Lupus Decoupled documentation](https://lupus-decoupled.org/get-started/create-new-project).

You will also need to apply this patch so the Drupal user session is available:

```bash
"drupal/lupus_decoupled": {
  "User session to the API": "https://git.drupalcode.org/project/lupus_decoupled/-/merge_requests/120.diff"
}
```

### 1. Adjust the `.env` file

Rename `example.local.env` to `.env`, then update it to match your environment settings.

### 2. Update `nuxt.config.ts` in Your Root App

Add the following configuration to extend your root **Nuxt** application:

```ts
export default defineNuxtConfig({
  extends: [
    [
      'github:StirStudios/stir_nuxt_base#release/nuxt-ui-lupus',
      { install: true },
    ],
  ],
})
```

This will automatically install all necessary dependencies.

> [!TIP]
> You can add your own style overrides by including a main.css file:

```ts
css: ['~/assets/css/main.css'],
```

## References & Resources

- **[Super Fast Nuxt UI 3 Theme Development with Tailwind CSS](https://ui3.nuxt.dev/getting-started)**
  Get started quickly with Nuxt UI 3 and Tailwind CSS.

- **[Lupus Decoupled Drupal](https://lupus-decoupled.org/)**
  Enjoy using Vue components with Nuxt and component-oriented Decoupled Drupal!

- **[Lupus Decoupled Drupal GitHub](https://github.com/drunomics/nuxtjs-drupal-ce)**
  Connects Nuxt v3 with Drupal via the Lupus Custom Elements Renderer.

- **[Lupus Decoupled Drupal (Drupal.org)](https://www.drupal.org/project/lupus_decoupled)**
  Explore component-oriented Decoupled Drupal with Nuxt!
