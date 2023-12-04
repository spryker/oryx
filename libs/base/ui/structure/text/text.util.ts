/**
 * Converts all links in the given string to oryx-link design system components.
 */
export const convertLinks = (raw: string): string => {
  return raw.replace(/<a(.*?)>(.*?)<\/a>/gis, (link) => {
    return `<oryx-link>${link}</oryx-link>`;
  });
};

/**
 * Converts all buttons in the given string to oryx-link design system components.
 */
export const convertButtons = (raw: string): string => {
  return raw.replace(/<button(.*?)>(.*?)<\/button>/gis, (button) => {
    return `<oryx-button>${button}</oryx-button>`;
  });
};

const headingRegex =
  /<(h[1-6]|small|strong|b)(.*?)>(.*?)<\/(h[1-6]|small|strong|b)>/gi;
const subtitleRegex =
  /<(span|div)\s+([^>]*)class="([^"]*\b(subtitle|caption|h[1-6])\b[^"]*)"([^>]*)>(.*?)<\/(span|div)>/gi;

/**
 * Converts all heading tags in the given string to oryx-link design system components. All
 * headings of the design system are supported.
 * - `<h1>...</h1>` (h1 - h6)
 * - `<caption>...</caption>`
 * - `<small>...</small>`
 * - `<strong>...</strong>`
 * - `<div class="subtitle">...</div>`
 *
 * The attributes of the heading are preserved, including styles and classes.
 */
export const convertHeadings = (raw: string): string => {
  return raw
    ?.replace(headingRegex, (_, tag, attributes, content) => {
      if (tag === 'b') tag = 'strong';
      return `<oryx-heading tag="${tag}" ${attributes}>${content}</oryx-heading>`;
    })
    .replace(
      subtitleRegex,
      (_, el, attrBefore, cls, tag, attrAfter, content) => {
        const attributes = ` ${attrBefore ?? ''} ${attrAfter ?? ''}`.trim();
        return `<oryx-heading typography="${tag}" ${cls} ${attributes}>${content}</oryx-heading>`;
      }
    );
};
