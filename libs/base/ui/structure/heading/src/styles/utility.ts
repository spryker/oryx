import { CSSResult, unsafeCSS } from 'lit';
import { HeadingTag } from '../heading.model';

/**
 * Heading utility function to generate heading styles base on the
 * Design System tokens. The block margin for heading styles defaults to 0px,
 * but can be overridden by passing a string.
 *
 * ```ts
 * headingUtil(HeadingTag.H1, '0 8px');
 * ```
 */
export const headingUtil = (tag: HeadingTag, marginBlock = '0'): CSSResult => {
  return unsafeCSS(`
    font-size: var(--oryx-typography-${tag}-size);
    font-weight: var(--oryx-typography-${tag}-weight);
    line-height: var(--oryx-typography-${tag}-line);
    margin-block: ${marginBlock};
  `);
};
