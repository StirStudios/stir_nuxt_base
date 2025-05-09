<script setup lang="ts">
import { formatCurrency } from '~/utils/formatUtils'

const fields = computed(() => webformState.fields)
const state = computed(() => webformState.state)

const guestCount = computed(() => Number(state.value['venueGuestCount'] || 0))

const taxRate = computed(() => {
  const raw = fields.value['taxRate']?.['#defaultValue']
  return Number(raw || 0) / 100
})

const serviceFeeRate = computed(() => {
  const raw = fields.value['serviceFee']?.['#defaultValue']
  return Number(raw || 0) / 100
})

function parseSelectedValues(selected: unknown): string[] {
  if (Array.isArray(selected)) return selected
  if (typeof selected === 'object' && selected !== null) {
    return Object.entries(selected)
      .filter(([, v]) => v === true)
      .map(([k]) => k)
  }
  return typeof selected === 'string' ? [selected] : []
}

// Core calculator for each field
function getFieldPrice(key: string): number {
  const field = fields.value[key]
  if (!field) return 0

  const selected = state.value[key]
  if (!selected) return 0

  const isPerGuest = field['#perGuest'] === true
  const props = field['#optionProperties'] || {}
  let values = parseSelectedValues(selected)

  // Dessert override: waive 'outsideDesserts' if any venue dessert is selected
  if (key === 'dessertSelection') {
    const hasVenueDessert = values.some(
      (val) =>
        val !== 'outsideDesserts' && typeof props[val]?.price === 'number',
    )
    if (hasVenueDessert) {
      values = values.filter((val) => val !== 'outsideDesserts')
    }
  }

  const base = values.reduce((sum, val) => sum + (props[val]?.price || 0), 0)
  return isPerGuest ? base * guestCount.value : base
}

function getFixedValue(key: string): number {
  const field = fields.value[key]
  const text = field?.['#text'] || ''
  return parseFloat(text.replace(/[^0-9.]/g, '')) || 0
}

function isTaxable(field: WebformFieldProps | undefined): boolean {
  return field?.['#isTaxable'] === true
}

function isServiceFeeApplicable(field: WebformFieldProps | undefined): boolean {
  return field?.['#serviceFeeApplicable'] === true
}

// Subtotals
const venueFixedFee = computed(() => getFixedValue('venueSiteFee'))

const venueTotal = computed(
  () => venueFixedFee.value + getFieldPrice('venueStaffing'),
)

const foodTotal = computed(() =>
  Object.entries(fields.value)
    .filter(([_, f]) => f.group === 'food')
    .reduce((sum, [key]) => sum + getFieldPrice(key), 0),
)

const drinkTotal = computed(() =>
  Object.entries(fields.value)
    .filter(([_, f]) => f.group === 'bar')
    .reduce((sum, [key]) => sum + getFieldPrice(key), 0),
)

const foodBarTotal = computed(() => foodTotal.value + drinkTotal.value)
const grandTotal = computed(() => venueTotal.value + foodBarTotal.value)

/**
 * Computes the total cost for the coordinator package including its ceremony
 */
const coordinatorPackageTotal = computed(() => {
  let total = 0

  Object.entries(fields.value).forEach(([key, field]) => {
    if (field['#group'] === 'vendor') {
      const vendorPrice = getFieldPrice(key)
      total += vendorPrice

      const ceremonyKey = field['#ceremony']

      if (ceremonyKey) {
        const pascalCaseKey = toPascalCase(ceremonyKey)

        // Attempt to find the ceremony field, fallback to PascalCase if not found
        const ceremonyField =
          fields.value[ceremonyKey] ?? fields.value[pascalCaseKey]

        // Only add to total if ceremony is checked in state
        if (ceremonyField && state.value[pascalCaseKey]) {
          const ceremonyPrice = ceremonyField['#optionProperties']?.price ?? 0
          total += Number(ceremonyPrice)
        }
      }
    }
  })

  return total
})

// Service fee total (only applies to marked fields)
const serviceableTotal = computed(() => {
  let total = isServiceFeeApplicable(fields.value['venueSiteFee'])
    ? venueFixedFee.value
    : 0

  for (const [key, field] of Object.entries(fields.value)) {
    if (isServiceFeeApplicable(field)) {
      total += getFieldPrice(key)
    }
  }

  return total
})

const serviceFeeTotal = computed(() =>
  Math.round(serviceableTotal.value * serviceFeeRate.value),
)

// Tax total (only applies to marked fields)
const taxableTotal = computed(() => {
  let total = isTaxable(fields.value['venueSiteFee']) ? venueFixedFee.value : 0

  for (const [key, field] of Object.entries(fields.value)) {
    if (isTaxable(field)) {
      total += getFieldPrice(key)
    }
  }

  return total
})

const taxTotal = computed(() => Math.round(taxableTotal.value * taxRate.value))

const finalTotal = computed(
  () => grandTotal.value + serviceFeeTotal.value + taxTotal.value,
)

// Guest-based auto-selection logic
// watchEffect(() => {
//   const count = state.value['venueGuestCount']
//   if (typeof count !== 'number') return
//
//   for (const [key, field] of Object.entries(fields.value)) {
//     if (field['#type'] !== 'checkboxes') continue
//     const opts = field['#optionProperties'] || {}
//     for (const [opt, props] of Object.entries(opts)) {
//       const [min, max] = props.range || []
//       if (count >= min && count <= max) {
//         state.value[key] = [opt]
//         break
//       }
//     }
//   }
// })
</script>

<template>
  {{ state }}
  <div class="bg-zinc-200 p-4">
    <h4 class="mb-2 text-center leading-tight font-bold">Calculator</h4>
    <ul class="space-y-1">
      <li class="flex justify-between font-bold">
        <span>Venue</span>
        <span>{{ formatCurrency(venueTotal) }}</span>
      </li>
      <li class="flex justify-between font-bold">
        <span>Food &amp; Bar</span>
        <span>{{ formatCurrency(foodBarTotal) }}</span>
      </li>
      <li class="flex justify-between font-bold">
        <span>Total Venue, Food &amp; Bar</span>
        <span>{{ formatCurrency(grandTotal) }}</span>
      </li>
      <li class="flex justify-between font-bold">
        <span>Add Coordinator Package</span>
        <span>{{ formatCurrency(coordinatorPackageTotal) }}</span>
      </li>
    </ul>
  </div>

  <ul class="space-y-1 p-4">
    <li class="flex justify-between">
      <span class="font-bold">Subtotal</span>
      <span>{{ formatCurrency(grandTotal) }}</span>
    </li>
    <li class="flex justify-between">
      <span class="font-bold">
        Service Fee ({{ fields['serviceFee']?.['#defaultValue'] || 0 }}%)
      </span>
      <span>{{ formatCurrency(serviceFeeTotal) }}</span>
    </li>
    <li class="flex justify-between">
      <span class="font-bold">
        Tax ({{ fields['taxRate']?.['#defaultValue'] || 0 }}%)
      </span>
      <span>{{ formatCurrency(taxTotal) }}</span>
    </li>
    <li class="flex justify-between border-t pt-2 font-bold">
      <span>Total</span>
      <span>{{ formatCurrency(finalTotal) }}</span>
    </li>
  </ul>
  <p class="mt-2 p-4 text-center text-sm font-bold">
    Send more info and next steps with Venue, Food & Bar, and Coordinators based
    on your selections?
  </p>
</template>
