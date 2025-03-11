import fs from 'fs'
import path from 'path'

// Tu run: node ./app/utils/generate-safelist.ts

// Define breakpoints and common class prefixes
const breakpoints = ['', 'sm:', 'md:', 'lg:', 'xl:']
const fractions = ['1/1', '1/2', '1/3', '1/4', '1/5']
const columns = Array.from({ length: 6 }, (_, i) => `grid-cols-${i + 1}`)
const spans = Array.from({ length: 4 }, (_, i) => `col-span-${i + 1}`)
const gaps = Array.from({ length: 20 }, (_, i) => `gap-${i + 1}`)
const spacings = [2, 5, 10, 20]
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

// Generate all needed class variants
const safelist = new Set<string>()

breakpoints.forEach((bp) => {
  fractions.forEach((frac) => safelist.add(`${bp}basis-${frac}`))
  columns.forEach((col) => safelist.add(`${bp}${col}`))
  spans.forEach((span) => safelist.add(`${bp}${span}`))
  gaps.forEach((gap) => safelist.add(`${bp}${gap}`))
  spacingClasses.forEach((cls) => safelist.add(`${bp}${cls}`))

  // ✅ Add `hidden` and `block` for each breakpoint
  safelist.add(`${bp}hidden`)
  safelist.add(`${bp}block`)
})

// ✅ Add additional required classes
const additionalClasses = [
  'sm:columns-2',
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

// Write to a `.txt` file for Tailwind to read
const safelistPath = path.resolve('app/assets/css/safelist.txt')
fs.writeFileSync(safelistPath, Array.from(safelist).join('\n'))

console.log(
  `✅ Safelist generated: ${safelist.size} classes saved to ${safelistPath}`,
)
