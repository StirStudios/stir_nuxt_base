export function cleanHTML(html: string): string {
  const allowedTagsWithAttributes =
    /<(\/?(ul|li|br|strong|b|i|em|p|span|div|a)(\s+[a-zA-Z-]+="[^"]*")*)\s*>/gi
  return html.replace(/<\/?[^>]+(>|$)/g, (tag) => {
    return allowedTagsWithAttributes.test(tag) ? tag : ''
  })
}
