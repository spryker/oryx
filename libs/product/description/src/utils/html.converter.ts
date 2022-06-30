/**
 * converts single line feeds to `<br />` and splits text with double
 * line breaks into paragraphs (`<p>...</p>`).
 */
export function convertLineFeedsToHTML(text: string): string {
  return text
    .split(/(\r?\n\s*){2}/)
    .map((s) => s.trim())
    .filter((s) => s.length)
    .map((s) => `<p>${s}</p>`)
    .join('')
    .split(/(\r?\n\s*){1}/)
    .map((s) => (s.startsWith('\n') ? '<br />' : s.trim()))
    .join('');
}
