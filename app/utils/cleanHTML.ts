export function cleanHTML(html: string): string {
  const allowedTags = [
    'p',
    'a',
    'strong',
    'em',
    'br',
    'ul',
    'li',
    'div',
    'span',
  ]

  return html
    .replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, tag, attributes) => {
      if (allowedTags.includes(tag.toLowerCase())) {
        return `<${tag}${attributes}>`
      }
      return '' // Remove disallowed tags
    })
    .replace(/<\/a>\s*<a/g, '</a> <a') // Ensure links don't get merged
    .replace(/(<a[^>]*>)([^<]+)(<\/a>)(\s*)(<\/a>)/g, '$1$2$5') // Remove duplicate closing tags
}
