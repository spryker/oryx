import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult, unsafeCSS } from 'lit';

/**
 * Provides carousel layout for compositions or components by adding a scrollable
 * element that contains child elements that are divided by item count (`--oryx-layout-item-count`).
 */
export const carouselLayout = (breakpoint: Breakpoint): CSSResult => css`
  :host(.${unsafeCSS(breakpoint)}-layout-carousel) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    align-items: stretch;
  }

  :host(.${unsafeCSS(breakpoint)}-layout-carousel) > * {
    scroll-snap-align: start;
    flex: 0 0
      var(
        --oryx-layout-item-width,
        calc(
          (100% / var(--oryx-layout-item-count, 1) * var(--oryx-layout-span, 1)) -
            (
              var(--oryx-layout-gap, 0px) *
                (var(--oryx-layout-item-count, 1) - 1) /
                (var(--oryx-layout-item-count, 1) * var(--oryx-layout-span, 1)) +
                var(--oryx-layout-margin, 0px) * 2
            )
        )
      );
  }
`;
