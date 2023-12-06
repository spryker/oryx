import { CSSResult, unsafeCSS } from 'lit';
import { HeadingTag } from '../heading.model.js';

/**
 * Heading utility function to generate heading styles base on the
 * Design System tokens. The block margin for heading styles defaults to 0px,
 * but can be overridden by passing a string.
 *
 * ```ts
 * headingUtil(HeadingTag.H1, { margin: { block:'0 8px'}});
 * ```
 */
export const headingUtil = (
  tag: HeadingTag,
  options: { margin?: string } = { margin: '0' }
): CSSResult => {
  const margin = !options?.margin ? `` : `margin: ${options.margin};`;

  return unsafeCSS(`
    font-size: var(--oryx-typography-${tag}-size);
    font-weight: var(--oryx-typography-${tag}-weight);
    line-height: var(--oryx-typography-${tag}-line);
    ${margin}
  `);
};
