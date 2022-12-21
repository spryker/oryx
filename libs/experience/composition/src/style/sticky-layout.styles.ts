import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult, unsafeCSS } from 'lit';

/**
 * Provides layout features for stickiness of a composition.
 *
 * We'll use a sticky position in combination with a (default) 0 offset from the top.
 * To avoid a conflict with a lengthy height blocking stickiness, we'll default the height to 0%.
 *
 */
export const stickyLayout = (breakpoint: Breakpoint): CSSResult => css`
  .${unsafeCSS(breakpoint)}-sticky {
    position: sticky;
    top: 0px;
    height: 0% !important;
    z-index: var(--oryx-z-index, 1);
  }
`;
