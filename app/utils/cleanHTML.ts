export function cleanHTML(html: string): string {
  if (typeof window === 'undefined') return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('script, style').forEach((el) => el.remove())

  // Remove event handler attributes like onclick, onerror, etc.
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    }
  })

  return doc.body.innerHTML.trim()
}
