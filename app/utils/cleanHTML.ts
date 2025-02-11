export function cleanHTML(html: string): string {
  const allowedTags = [
    'ul',
    'li',
    'br',
    'strong',
    'b',
    'i',
    'em',
    'p',
    'span',
    'div',
    'a',
  ]

  return html.replace(
    /<\/?([a-zA-Z0-9]+)([^>]*)>/g,
    (match, tag, attributes) => {
      if (allowedTags.includes(tag.toLowerCase())) {
        // If it's an <a> tag, ensure it has an href attribute
        if (tag.toLowerCase() === 'a') {
          return attributes.includes('href=') ? `<a${attributes}>` : '' // Remove <a> without href
        }
        return `<${tag}${attributes}>`
      }
      return '' // Remove disallowed tags
    },
  )
}
