import {
  materialVariant,
  materialVariantWithPB,
  materialVariantMuted,
} from './utils/uiVariants'

export default defineAppConfig({
  colorMode: {
    forced: false,
    lightRoutes: [],
  },

  cookieConsent: {
    enabled: false,
  },

  stirTheme: {
    pdf: false,
    crumbs: false,

    h1: 'mb-20 text-center text-6xl',
    container: 'max-w-(--ui-container) mx-auto px-4 md:px-5 lg:px-8',

    header: 'md:px-auto fixed top-0 z-30 w-full !p-0',

    navigation: {
      mode: 'fixed',
      logo: true,
      logoSize: 'h-[5rem]',
      isHidden: false,
      transparentTop: false,
      base: 'h-auto transform py-3 duration-500',
      background:
        'border-none bg-white/90 shadow backdrop-blur-md dark:bg-gray-950/70',
      color: 'primary',
      variant: 'link',
      toggleType: 'slideover',
      toggleDirection: 'right',
      highlight: {
        show: false,
        color: 'primary',
      },
      slideover: {
        logo: true,
        link: 'text-xl text-center block my-3 uppercase',
        body: 'flex h-full flex-col justify-center text-center',
      },
    },

    footer: {
      hideEmail: false,
      base: 'mt-20 bg-accented dark:bg-muted/50 py-10 text-default text-sm',
      left: 'text-sm leading-relaxed lg:text-left',
      right: 'lg:items-end flex flex-col items-center gap-2 lg:text-right',
      footerLinks: 'transition-colors text-primary hover:text-primary/90',
      poweredby: true,
    },

    media: {
      base: 'relative h-full w-full overflow-hidden object-cover',
      rounded: 'rounded-xl',
    },

    card: {
      base: 'relative isolate overflow-hidden rounded-xl bg-black/80 dark:bg-black py-16 text-white sm:py-20',
      effect:
        'absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6',
    },

    gradients: {
      1: 'bg-gradient-to-tr from-[#f35b0f] to-[#6b4ef2]',
      2: 'bg-gradient-to-r from-[#ff7f50] to-[#1e90ff]',
      3: 'bg-gradient-to-b from-[#7b2ff7] to-[#e53e3e]',
    },

    hero: {
      base: 'hero flex items-center justify-center overflow-hidden',
      mediaSpacing: 'min-h-[22rem] lg:min-h-[35rem] mb-20',
      noMediaSpacing: 'pt-30 lg:pt-54',
      noMediaFallback:
        'bg-gradient-to-b from-gray-900 via-gray-800 to-black/70',
      overlay:
        'relative min-h-[22rem] lg:min-h-[35rem] after:to-bg-black-10 after:absolute after:inset-0 after:z-auto after:h-full after:w-full after:bg-gradient-to-b after:from-black/80 after:via-black/50',
      isFront: 'h-screen',
      image: {
        base: 'absolute min-h-full w-auto max-w-none min-w-full',
        isFront: 'object-right-85 object-cover',
      },
      text: {
        base: 'z-10 max-w-2xl relative p-5 text-center',
        isFront: 'absolute bottom-0 left-0 p-10 lg:p-24',
      },
      hide: 'pt-30',
    },

    carousel: {
      padding: 'pb-12',
      root: '',
    },

    modal: {
      header: true,
    },

    scrollButton: {
      base: 'fixed bottom-4 left-4 z-50 rounded-full p-2 shadow-md transition-opacity duration-300',
      icon: 'i-heroicons:arrow-up',
      variant: 'solid',
      showAtScrollY: 200,
    },

    error: {
      label: 'Take me back home',
      color: 'primary',
      variant: 'solid',
    },

    // Forms
    webform: {
      spacing: 'space-y-5',
      spacingLarge: 'space-y-10',
      labels: {
        floating: false,
        base: [
          'pointer-events-none absolute -top-1.5 left-0 text-xs font-medium text-dimmed transition-all',
          'peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-dimmed',
          'peer-focus:-top-1.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-highlighted',
        ],
      },
      fieldGroupHeader: 'mb-6 text-xl font-semibold',
      fieldGroup: 'space-y-10',
      fieldInput: 'w-full',
      response: 'px-6 py-3 bg-muted rounded-lg italic',
      description: 'desc mb-3 text-muted',
      help: 'desc my-3 text-muted',
      submitAlign: '',
      buttonSize: '2xl',
      variant: 'outline',
    },

    turnstile: {
      appearance: 'always',
      label: 'Let us know you’re human',
    },

    animations: {
      once: false,
    },

    aspectRatios: {
      portrait: 'aspect-[9/16]',
      landscape: 'aspect-[16/9]',
      square: 'aspect-square',
      fourThree: 'aspect-[4/3]',
    },
  },

  ui: {
    colors: {
      primary: 'lime',
      neutral: 'zinc',
    },

    button: {
      slots: {
        base: 'transition-all duration-300',
      },
      variants: {
        size: {
          '2xl': {
            base: 'px-10 py-3 text-md gap-2',
          },
          variant: {
            material: materialVariantMuted,
          },
        },
      },
      defaultVariants: {
        size: 'xl',
      },
    },

    formField: {
      slots: {
        label: 'block font-medium text-dimmed',
        container: 'mt-1',
        error: 'mt-1 text-error',
      },
    },

    input: {
      variants: {
        variant: {
          material: materialVariant,
        },
      },
      defaultVariants: {
        size: 'xl',
      },
    },

    select: {
      variants: {
        variant: {
          material: materialVariantWithPB,
        },
      },
      defaultVariants: {
        size: 'xl',
      },
    },

    selectMenu: {
      variants: {
        variant: {
          material: materialVariantWithPB,
        },
      },
      defaultVariants: {
        size: 'xl',
      },
    },

    textarea: {
      variants: {
        variant: {
          material: materialVariant,
        },
      },
      defaultVariants: {
        size: 'xl',
        variant: 'material',
      },
    },
  },
})
