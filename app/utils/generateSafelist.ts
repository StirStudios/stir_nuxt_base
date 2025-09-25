import fs from 'fs'
import path from 'path'

// Run this script with: node ./app/utils/generateSafelist.ts

// Define breakpoints
const breakpoints = ['', 'sm:', 'md:', 'lg:', 'xl:']

// ✅ Limit grid columns to a max of 5
const columns = Array.from({ length: 5 }, (_, i) => `grid-cols-${i + 1}`)

// ✅ Limit col-span to a max of 3 (we rarely go higher)
const spans = Array.from({ length: 3 }, (_, i) => `col-span-${i + 1}`)

// ✅ Limit gaps to a max of 10
const gaps = [...Array.from({ length: 10 }, (_, i) => `gap-${i + 1}`), 'gap-20']

// ✅ Add space-y-* classes up to 10 and space-y-20
const spaceY = [
  ...Array.from({ length: 10 }, (_, i) => `space-y-${i + 1}`),
  'space-y-20',
]

// ✅ Limit basis to only 1/2, 1/3, 1/4, and 1/5
const basisValues = [
  'basis-1/1',
  'basis-1/2',
  'basis-1/3',
  'basis-1/4',
  'basis-1/5',
  'basis-1/6',
  'basis-1/7',
]

// ✅ Limit columns-{n} to a max of 5 (for multi-column layouts)
const columnsDynamic = Array.from({ length: 5 }, (_, i) => `columns-${i + 1}`)

// ✅ Limit spacing sizes to a reasonable range
const spacings = [2, 5, 10, 15, 20] // Removed 25 for efficiency
const spacingClasses = spacings.flatMap((size) => [
  `p-${size}`,
  `pt-${size}`,
  `pr-${size}`,
  `pb-${size}`,
  `pl-${size}`,
  `px-${size}`,
  `py-${size}`,
  `m-${size}`,
  `mt-${size}`,
  `mr-${size}`,
  `mb-${size}`,
  `ml-${size}`,
  `mx-${size}`,
  `my-${size}`,
])

// Generate safelist
const safelist = new Set<string>()

breakpoints.forEach((bp) => {
  columns.forEach((col) => safelist.add(`${bp}${col}`))
  columnsDynamic.forEach((col) => safelist.add(`${bp}${col}`))
  spans.forEach((span) => safelist.add(`${bp}${span}`))
  gaps.forEach((gap) => safelist.add(`${bp}${gap}`))
  spaceY.forEach((space) => safelist.add(`${bp}${space}`))
  basisValues.forEach((basis) => safelist.add(`${bp}${basis}`))
  spacingClasses.forEach((cls) => safelist.add(`${bp}${cls}`))

  // ✅ Add visibility helpers for each breakpoint
  safelist.add(`${bp}hidden`)
  safelist.add(`${bp}block`)
})

// ✅ Add additional required classes
const additionalClasses = [
  'lg:block',
  'mx-auto',
  'm-auto',
  'lg:flex',
  'sm:w-lg',
  'sm:max-w-lg',
  'lg:max-w-2xl',
  'lg:max-w-3xl',
  'lg:max-w-4xl',
  'lg:grid-cols-[8fr_4fr]',
  'lg:grid-cols-[4fr_8fr]',
  'text-muted',
  'list-none',
  'bg-black/80',
]

additionalClasses.forEach((cls) => safelist.add(cls))

// ✅ Write to Tailwind safelist file
const safelistPath = path.resolve('app/assets/css/safelist.txt')
fs.writeFileSync(safelistPath, Array.from(safelist).join('\n'))

console.log(
  `✅ Safelist generated: ${safelist.size} classes saved to ${safelistPath}`,
)
