import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult } from 'lit';
import { selector } from './utils';

/**
 * Provides carousel layout for compositions or components by adding a scrollable
 * element that contains child elements that are divided by item count (`--oryx-layout-item-count`).
 */
export const carouselLayout = (breakpoint?: Breakpoint): CSSResult => css`
  :host(.${selector('layout-carousel', breakpoint)}) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    align-items: stretch;
  }

  :host(.${selector('layout-carousel', breakpoint)}) > *,
  :host(.${selector('layout-carousel', breakpoint)}) ::slotted(*) {
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

  :host(.${selector('layout-carousel', breakpoint)}) > :defined,
  :host(.${selector('layout-carousel', breakpoint)}) ::slotted(*) {
    scroll-snap-align: start;
  }
`;
