<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types'
import { cleanHTML } from '~/utils/cleanHTML'
import { useEventBus } from '@vueuse/core'
import { handleTabChange } from '~/utils/visibilityUtils'
import { enforceGroupLimit, enforceMaxSelected } from '~/utils/selectionUtils'
import { normalizeValue } from '~/utils/stringUtils'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

/**
 * Additional labor is a venue-specific derived pricing feature.
 * This guard ensures the logic is completely inert for all other fields.
 */
const supportsAdditionalLabor = computed(() => {
  return (
    props.fieldName === 'additionalLaborFnb' &&
    Array.isArray(
      props.field['#rules']?.multiplierRules ||
        props.field['#rules']?.multiplier_rules,
    )
  )
})

const descriptionContent = shallowRef<string>('')
const tabBus = useEventBus<string>('tab-changed')

onMounted(() => {
  if (!Array.isArray(props.state[props.fieldName])) {
    props.state[props.fieldName] = []
  }
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  // Listen for tab changes and clear values if not visible
  tabBus.on((tabValue: string) => {
    handleTabChange(
      props.field['#states']?.visible,
      tabValue,
      props.state,
      props.fieldName,
    )
  })

  // Apply model update logic
  handleModelUpdate(props.state[props.fieldName])
})

const isFieldDisabled = computed(() => props.field['#disabled'] === true)

const getComparisonValue = (key?: string): number | null => {
  if (!key) return null
  const normalizedKey = Object.keys(props.state).find(
    (k) => normalizeValue(k) === normalizeValue(key),
  )
  const val = normalizedKey ? props.state[normalizedKey] : null
  return typeof val === 'number' || typeof val === 'string' ? Number(val) : null
}

const items = computed(() => {
  return Object.entries(props.field['#options'] || {}).map(([key, label]) => {
    const rawProps = props.field['#optionProperties']?.[key] || {}
    const [min, max] = rawProps.range || []
    const compareKey = rawProps.checkAgainst
    const valueToCompare = getComparisonValue(compareKey)

    const disableWhen = rawProps.disableWhen
    const conditionValue = disableWhen?.field
      ? props.state[disableWhen.field]
      : null

    const selected = Array.isArray(conditionValue)
      ? conditionValue
      : typeof conditionValue === 'object' && conditionValue !== null
        ? Object.keys(conditionValue).filter((k) => conditionValue[k] === true)
        : []

    const disabledByRule =
      !!disableWhen?.field &&
      !!disableWhen?.includes &&
      selected.includes(disableWhen.includes)

    const disabledByRange =
      valueToCompare !== null &&
      ((typeof min === 'number' && valueToCompare < min) ||
        (typeof max === 'number' && valueToCompare > max))

    const disabled = isFieldDisabled.value || disabledByRule || disabledByRange

    return {
      label,
      value: key,
      props: { ...rawProps, disabled },
      disabled,
    }
  })
})

const additionalLaborBreakdown = computed(() => {
  if (!supportsAdditionalLabor.value) return null

  const rules =
    props.field['#rules']?.multiplierRules ||
    props.field['#rules']?.multiplier_rules ||
    []

  const optionProps = props.field['#optionProperties'] || {}
  const optionLabels = props.field['#options'] || {}

  const breakdown: { label: string; count: number }[] = []
  let total = 0

  const sourceFieldToLabel: Record<string, string> = {}

  const autoRules =
    props.field['#rules']?.autoSelectWhen ||
    props.field['#rules']?.auto_select_when ||
    []

  autoRules.forEach((rule: any) => {
    const sourceField = rule.when?.all?.[0]?.field
    const optionKey = rule.select?.option
    if (!sourceField || !optionKey) return

    const resolvedOptionKey = Object.keys(optionLabels).find(
      (k) => normalizeValue(k) === normalizeValue(optionKey),
    )

    if (resolvedOptionKey) {
      sourceFieldToLabel[normalizeValue(sourceField)] =
        optionLabels[resolvedOptionKey]
    }
  })

  rules.forEach((rule: any) => {
    const sourceKey = Object.keys(props.state).find(
      (k) =>
        normalizeValue(k) ===
        normalizeValue(rule.sourceField || rule.source_field),
    )
    if (!sourceKey) return

    const selected = props.state[sourceKey]
    const count = Array.isArray(selected)
      ? selected.length
      : typeof selected === 'object' && selected !== null
        ? Object.keys(selected).filter((k) => selected[k] === true).length
        : 0

    if (count <= 1) return

    const step = Number(rule.step || 2)
    const units = Math.ceil((count - 1) / step)
    if (units <= 0) return

    const optionKey = Object.keys(optionProps).find(
      (k) => normalizeValue(k) === normalizeValue(rule.option),
    )
    const unitPrice = optionKey ? optionProps[optionKey]?.price : 0

    breakdown.push({
      label:
        sourceFieldToLabel[normalizeValue(rule.sourceField)] ||
        sourceKey.replace(/_/g, ' '),
      count: units,
    })

    total += units * unitPrice
  })

  return breakdown.length ? { total, units: breakdown } : null
})

/**
 * Handle Model Update:
 * - Enforce the group limit
 * - Enforce the max selections
 */
const handleModelUpdate = (val: string[]) => {
  const disabledKeys = new Set(
    items.value.filter((item) => item.disabled).map((item) => item.value),
  )

  const previous = props.state[props.fieldName] || []

  let updated = Array.from(
    new Set([
      ...val,
      ...previous.filter((key: string) => disabledKeys.has(key)),
    ]),
  )

  // ======================================================
  // LINKED OPTIONS (AUTO-ADD + AUTO-REMOVE)
  // ======================================================

  const requiredByLink = new Set<string>()

  // Add linked options when parent is selected
  for (const selectedKey of updated) {
    const resolvedKey =
      Object.keys(props.field['#optionProperties'] || {}).find(
        (k) => normalizeValue(k) === normalizeValue(selectedKey),
      ) || selectedKey

    const meta = props.field['#optionProperties']?.[resolvedKey]
    const linked = meta?.linked_to || meta?.linkedTo || []

    for (const linkedKey of linked) {
      const resolvedLinkedKey =
        Object.keys(props.field['#optionProperties'] || {}).find(
          (k) => normalizeValue(k) === normalizeValue(linkedKey),
        ) || linkedKey

      requiredByLink.add(resolvedLinkedKey)

      if (
        !updated.includes(resolvedLinkedKey) &&
        !disabledKeys.has(resolvedLinkedKey)
      ) {
        updated.push(resolvedLinkedKey)
      }
    }
  }

  // Remove auto-linked options that are no longer required
  updated = updated.filter((key) => {
    const isAutoLinked = Object.values(
      props.field['#optionProperties'] || {},
    ).some((opt) =>
      (opt.linked_to || opt.linkedTo || []).some(
        (l: string) => normalizeValue(l) === normalizeValue(key),
      ),
    )

    return !isAutoLinked || requiredByLink.has(key)
  })

  updated = enforceGroupLimit(
    updated,
    props.fieldName,
    props.field['#group'],
    props.field['#groupMaxSelected'],
    props.state,
    webformState,
  )

  updated = enforceMaxSelected(updated, props.field['#maxSelected'])

  props.state[props.fieldName] = updated
}

watch(
  additionalLaborBreakdown,
  (val) => {
    if (!supportsAdditionalLabor.value) return

    const optionKey = 'additionalLaborUnit'
    const current: string[] = props.state[props.fieldName] || []

    const hasLabor =
      !!val && Array.isArray(val.units) && val.units.length > 0 && val.total > 0

    if (hasLabor && !current.includes(optionKey)) {
      props.state[props.fieldName] = [...current, optionKey]
    }

    if (!hasLabor && current.includes(optionKey)) {
      props.state[props.fieldName] = current.filter((v) => v !== optionKey)
    }
  },
  { immediate: true },
)
</script>

<template>
  <UCheckboxGroup
    class="form-input w-full"
    :items="items"
    :model-value="props.state[props.fieldName]"
    @update:model-value="handleModelUpdate"
  >
    <template #label="{ item }">
      <span
        class="label"
        :class="{ 'text-muted': item.props.disabled }"
        v-html="item.label"
      />
      <span
        v-if="item.props.description"
        :class="{ 'text-muted': item.props.disabled }"
        v-html="item.props.description"
      />
      <span
        v-if="item.value === 'additionalLaborUnit' && additionalLaborBreakdown"
        class="extra"
      >
        ${{ additionalLaborBreakdown.total.toLocaleString() }}
      </span>

      <span v-else-if="item.props.price" class="extra">
        ${{ item.props.price.toLocaleString() }}
      </span>

      <span
        v-if="item.value === 'additionalLaborUnit' && additionalLaborBreakdown"
        class="extra text-muted mt-1 block text-xs"
      >
        <span
          v-for="unit in additionalLaborBreakdown.units"
          :key="unit.label"
          class="block"
        >
          {{ unit.count }} × {{ unit.label }}
        </span>
      </span>
    </template>
  </UCheckboxGroup>
</template>
