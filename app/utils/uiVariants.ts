const materialBase =
  'bg-transparent rounded-none border-b-2 border-b-[var(--ui-border-accented)] !px-0 transition-all transition-colors focus:border-b-[var(--ui-border)] dark:border-b-[var(--ui-border)] focus:dark:border-b-[var(--ui-border-inverted)] aria-invalid:ring-0 aria-invalid:border-b-[var(--ui-error)] aria-invalid:dark:border-b-[var(--ui-error)]'

export const materialVariant = `text-(--ui-text-highlighted) ${materialBase}`
export const materialVariantWithPB = `${materialVariant} !pb-3`
export const materialVariantMuted = `text-(--ui-text-muted) ${materialBase} py-3 text-md gap-2`
