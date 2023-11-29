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
  /<(h[1-6]|small|caption|strong)(.*?)>(.*?)<\/(h[1-6]|small|caption|strong)>/gis;
const subtitleRegex =
  /<(span|div)\s+([^>]*)class="([^"]*\b(subtitle|h[1-6])\b[^"]*)"([^>]*)>(.*?)<\/(span|div)>/gis;

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
      return `<oryx-heading tag="${tag}" ${attributes}>${content}</oryx-heading>`;
    })
    .replace(
      subtitleRegex,
      (_, el, attrBefore, cls, tag, attrAfter, content) => {
        const attributes =
          attrBefore || attrAfter
            ? ` ${attrBefore ?? ''} ${attrAfter ?? ''}`
            : '';
        const classNames = cls.replace(tag, '').trim().length
          ? `class="${cls.replace(tag, '')}"`
          : ``;

        return `<oryx-heading typography="${tag}" ${classNames} ${attributes}>${content}</oryx-heading>`;
      }
    );
};
