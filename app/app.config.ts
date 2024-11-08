export default defineAppConfig({
  stirTheme: {
    mediaRounded: 'rounded-xl',
    aspectRatios: {
      portrait: 'aspect-[9/16]',
      landscape: 'aspect-[16/9]',
      square: 'aspect-square',
      fourThree: 'aspect-[4/3]',
    },
    gridLayouts: {
      gridClasses: {
        one_column: 'sm:grid-cols-1 lg:grid-cols-1',
        two_column: 'sm:grid-cols-1 lg:grid-cols-2',
        three_column: 'sm:grid-cols-2 lg:grid-cols-3',
        four_column: 'sm:grid-cols-2 lg:grid-cols-4',
      },
      viewGridClasses: {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 md:grid-cols-3',
        4: 'sm:grid-cols-2 md:grid-cols-4',
      },
      containerClass: 'mx-auto container px-4 md:px-5',
      defaultGap: 'gap-4 md:gap-6 lg:gap-10',
      viewDefaultGap: 'gap-5 lg:gap-10 xl:gap-16',
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
  },
})
