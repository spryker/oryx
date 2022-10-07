import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult, unsafeCSS } from 'lit';

const columnLayout = (breakpoint: Breakpoint): CSSResult => css`
  :host(.${unsafeCSS(breakpoint)}-layout-column) {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    flex-direction: row;
    align-items: stretch;
  }
`;

/**
 * Allows to render composition items in a single column. Column items
 * will not wrap to the next line and can have custom widths.
 *
 * The item width added inline in each composition item but default
 * (by browser nature) to a `flex: auto`, which means that they are equally
 * divided over the horizontal axis.
 */
export const columnLayoutStyles = css`
  @layer layout {
    ${columnLayout(Breakpoint.Xs)}

    @media (min-width: 768px) {
      ${columnLayout(Breakpoint.Md)}
    }

    @media (min-width: 1024px) {
      ${columnLayout(Breakpoint.Lg)}
    }
  }
`;
