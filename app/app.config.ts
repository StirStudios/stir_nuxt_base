import type { StirThemeConfig } from '~/types/StirThemeConfig'

export default defineAppConfig({
  forceColorMode: {
    enabled: false,
    preference: 'dark',
  },
  stirTheme: {
    mediaRounded: 'rounded-xl',
    aspectRatios: {
      portrait: 'aspect-[9/16]',
      landscape: 'aspect-[16/9]',
      square: 'aspect-square',
      fourThree: 'aspect-[4/3]',
    },
    grid: {
      cols: {
        one_column: 'sm:grid-cols-1 lg:grid-cols-1',
        two_column: 'sm:grid-cols-1 lg:grid-cols-2',
        three_column: 'sm:grid-cols-2 lg:grid-cols-3',
        four_column: 'sm:grid-cols-2 lg:grid-cols-4',
      },
      viewCols: {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 md:grid-cols-3',
        4: 'sm:grid-cols-2 md:grid-cols-4',
        5: 'sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
      },
      wrapCols: 'grid gap-5 lg:gap-10 xl:gap-16 grid-cols-2 lg:grid-cols-4',
      container: 'mx-auto container px-4 md:px-5',
      gap: 'gap-4 md:gap-6 lg:gap-10',
      viewGap: 'gap-5 lg:gap-10 xl:gap-16',
    },
    carousel: {
      container: '',
      mediaHeight: 'h-64',
      mediaRounded: 'rounded-xl',
    },
    scrollButton: {
      base: 'fixed bottom-4 left-4 z-50 rounded-full p-2 text-white shadow-md transition-opacity duration-300',
      icon: 'i-heroicons:arrow-up',
      variant: 'solid',
      showAtScrollY: 200,
    },
  },
  ui: {
    // strategy: 'override',
    primary: 'lime',
    gray: 'zinc',
    button: {
      base: 'transition-all duration-300',
      size: {
        '2xs': 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
        xl: 'text-2xl',
      },
    },
    icon: {
      size: {
        '2xs': 'h-3 w-3',
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
      },
    },
  },
})
