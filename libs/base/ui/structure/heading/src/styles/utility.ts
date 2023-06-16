import { CSSResult, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';
import { HeadingTag } from '../heading.model';

export const headingUtil = (tag: HeadingTag): CSSResult =>
  unsafeCSS(`
    --line-height: var(--oryx-typography-${tag}-line);

    font-size: var(--oryx-typography-${tag}-size);
    font-weight: var(--oryx-typography-${tag}-weight);
    line-height: var(--line-height);
    margin:0;${when(tag === 'subtitle', () => `text-transform: uppercase;`)}
  `);
