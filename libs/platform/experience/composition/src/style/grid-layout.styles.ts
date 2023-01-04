import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult } from 'lit';
import { selector } from './utils';

/**
 * Provides style rules for a grid based layout. Grid items are organised over the grid
 * columns, using 4, 2 or 1 column by default.
 */
export const gridLayout = (breakpoint?: Breakpoint): CSSResult => css`
  :host(.${selector('layout-grid', breakpoint)}) {
    display: grid;
    grid-template-rows: repeat(auto-fit, var(--oryx-layout-height));
    grid-auto-rows: var(--oryx-layout-height, minmax(min-content, max-content));
    grid-template-columns: repeat(var(--oryx-layout-item-count, 1), 1fr);
  }

  :host(.${selector('layout-grid', breakpoint)}) > *,
  :host(.${selector('layout-grid', breakpoint)}) ::slotted(*) {
    grid-column: span
      min(var(--oryx-layout-span, 1), var(--oryx-layout-item-count, 1));
  }
`;
