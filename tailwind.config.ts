import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

// https://www.tints.dev/?vermillion=E9423F&isabelline=F5F0EB&night=14161A

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // black: '#14161A',
        // white: '#F5F0EB',
        // vermillion: {
        //   50: '#FDEDED',
        //   100: '#FBDBDA',
        //   200: '#F6B2B1',
        //   300: '#F28E8D',
        //   400: '#ED6663',
        //   500: '#E9423F',
        //   600: '#D21B18',
        //   700: '#A01512',
        //   800: '#690E0C',
        //   900: '#370706',
        //   950: '#1B0403',
        // },
      },
      fontFamily: {
        sans: ['"DM San"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(basis-\d\/\d|grid-cols-\d|columns-\d|col-span-\d|block|hidden|gap-\d+|max-w-screen-(sm|md|lg|xl|2xl)|p-(2|5|10|20)|pt-(2|5|10|20)|pr-(2|5|10|20)|pb-(2|5|10|20)|pl-(2|5|10|20)|px-(2|5|10|20)|py-(2|5|10|20)|m-(2|5|10|20)|mt-(2|5|10|20)|mr-(2|5|10|20)|mb-(2|5|10|20)|ml-(2|5|10|20)|mx-(2|5|10|20)|my-(2|5|10|20)|lg:(pb|py)-20|lg:(p|pl|pr|pb|pt)-20)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  ],
}
