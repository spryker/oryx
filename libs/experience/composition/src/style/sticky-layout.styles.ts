import { Breakpoint } from '@spryker-oryx/experience';
import { css, CSSResult } from 'lit';
import { selector } from './utils';

/**
 * Provides layout features for stickiness of a composition.
 *
 * We'll use a sticky position in combination with a (default) 0 offset from the top.
 * To avoid a conflict with a lengthy height blocking stickiness, we'll default the height to 0%.
 */
export const stickyLayout = (breakpoint?: Breakpoint): CSSResult => css`
  :host(.${selector('sticky', breakpoint)}),
  :host .${selector('sticky', breakpoint)} {
    position: sticky;
    top: 0px;
    height: 0%;
    z-index: var(--oryx-z-index, 1);
  }
`;
