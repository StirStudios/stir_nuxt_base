import fs from 'fs'
import path from 'path'

// Run this script with: node ./app/utils/generateSafelist.ts

// Define breakpoints
const breakpoints = ['', 'sm:', 'md:', 'lg:', 'xl:']

// Define dynamic class lists
const columns = Array.from({ length: 6 }, (_, i) => `grid-cols-${i + 1}`)
const spans = Array.from({ length: 4 }, (_, i) => `col-span-${i + 1}`)
const gaps = Array.from({ length: 30 }, (_, i) => `gap-${i + 1}`) // Extended to 30
const columnsDynamic = Array.from({ length: 10 }, (_, i) => `columns-${i + 1}`) // Extended for columns-{n}

// Define common spacing sizes
const spacings = [2, 5, 10, 15, 20, 25] // Added 15 for consistency
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
  columnsDynamic.forEach((col) => safelist.add(`${bp}${col}`)) // ✅ Ensures `columns-{n}`
  spans.forEach((span) => safelist.add(`${bp}${span}`))
  gaps.forEach((gap) => safelist.add(`${bp}${gap}`))
  spacingClasses.forEach((cls) => safelist.add(`${bp}${cls}`))

  // ✅ Add visibility helpers for each breakpoint
  safelist.add(`${bp}hidden`)
  safelist.add(`${bp}block`)
})

// ✅ Add additional required classes
const additionalClasses = [
  'sm:columns-2',
  'md:columns-3',
  'lg:columns-4',
  'xl:columns-5',
  'sm:gap-2',
  'md:gap-5',
  'lg:gap-10',
  'xl:gap-15',
  'lg:block',
  'mx-auto',
  'm-auto',
  'sm:w-lg',
  'lg:w-2xl',
  'lg:w-3xl',
  'lg:w-4xl',
  'lg:grid-cols-[8fr_4fr]',
  'lg:grid-cols-[4fr_8fr]',
]

additionalClasses.forEach((cls) => safelist.add(cls))

// ✅ Write to Tailwind safelist file
const safelistPath = path.resolve('app/assets/css/safelist.txt')
fs.writeFileSync(safelistPath, Array.from(safelist).join('\n'))

console.log(
  `✅ Safelist generated: ${safelist.size} classes saved to ${safelistPath}`,
)
