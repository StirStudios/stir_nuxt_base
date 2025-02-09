export function sanitizeHTML(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}
