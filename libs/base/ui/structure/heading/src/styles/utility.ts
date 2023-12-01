import { CSSResult, unsafeCSS } from 'lit';
import { HeadingTag } from '../heading.model';

export const headingUtil = (tag: HeadingTag): CSSResult =>
  unsafeCSS(`
    font-size: var(--oryx-typography-${tag}-size);
    font-weight: var(--oryx-typography-${tag}-weight);
    line-height: var(--oryx-typography-${tag}-line);
    margin:0;
  `);

export const headingNoMarginUtil = (tag: HeadingTag): CSSResult =>
  unsafeCSS(`
    font-size: var(--oryx-typography-${tag}-size);
    font-weight: var(--oryx-typography-${tag}-weight);
    line-height: var(--oryx-typography-${tag}-line);
  `);
