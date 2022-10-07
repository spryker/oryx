import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult, unsafeCSS } from 'lit';

const stickyLayout = (breakpoint: Breakpoint): CSSResult => css`
  .${unsafeCSS(breakpoint)}-sticky {
    position: sticky;
    top: 0px;
    height: 0%;
  }
`;

/**
 * Provides layout features for stickiness of a composition.
 *
 * We'll use a sticky position in combination with a (default) 0 offset from the top.
 * To avoid a conflict with a lengthy height blocking stickiness, we'll default the height to 0%.
 */
export const stickyLayoutStyles = css`
  @layer layout {
    ${stickyLayout(Breakpoint.Xs)}

    @media (min-width: 768px) {
      ${stickyLayout(Breakpoint.Md)}
    }

    @media (min-width: 1024px) {
      ${stickyLayout(Breakpoint.Lg)}
    }
  }
`;
