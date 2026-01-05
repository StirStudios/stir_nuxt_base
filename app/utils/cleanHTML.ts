export function cleanHTML(html: string): string {
  // SSR: return original string (do NOT blank it out)
  if (typeof window === 'undefined') return (html || '').trim()

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('script, style').forEach((el) => el.remove())

  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on')) el.removeAttribute(attr.name)
    }
  })

  return doc.body.innerHTML.trim()
}
