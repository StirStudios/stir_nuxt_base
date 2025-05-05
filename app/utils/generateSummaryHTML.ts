export function generateSummaryHTML({
  subtotal = 0,
  tax = 0,
  serviceFee = 0,
  total = 0,
  selectedItems = [],
}: {
  subtotal?: number
  tax?: number
  serviceFee?: number
  total?: number
  selectedItems?: { label: string; price: number }[]
} = {}): string {
  return `
    <p><strong>Summary</strong></p>
    <ul>
      ${selectedItems
        .map((item) => `<li>${item.label}: $${item.price.toFixed(2)}</li>`)
        .join('')}
    </ul>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>
    <p><strong>Service Fee:</strong> $${serviceFee.toFixed(2)}</p>
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
  `
}
