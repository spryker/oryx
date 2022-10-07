import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult, unsafeCSS } from 'lit';

const gridLayout = (breakpoint: Breakpoint): CSSResult => css`
  :host(.${unsafeCSS(breakpoint)}-layout-grid) {
    display: grid;
    grid-template-rows: repeat(auto-fit, var(--oryx-layout-height));
    grid-auto-rows: var(--oryx-layout-height, minmax(min-content, max-content));
    grid-template-columns: repeat(var(--oryx-layout-item-count, 1), 1fr);
  }

  :host(.${unsafeCSS(breakpoint)}-layout-grid) > * {
    grid-column: span
      min(var(--oryx-layout-span, 1), var(--oryx-layout-item-count, 1));
  }
`;

/**
 * Provides style rules for a grid based layout. Grid items are organised over the grid
 * columns, using 4, 2 or 1 column by default.
 */
export const gridLayoutStyles = css`
  @layer layout {
    ${gridLayout(Breakpoint.Xs)}

    @media (min-width: 768px) {
      ${gridLayout(Breakpoint.Md)}
    }

    @media (min-width: 1024px) {
      ${gridLayout(Breakpoint.Lg)}
    }
  }
`;
