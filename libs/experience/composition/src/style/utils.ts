import { Breakpoint } from '@spryker-oryx/experience';
import { CSSResult, unsafeCSS } from 'lit';

export const selector = (
  type: 'layout-grid' | 'layout-carousel' | 'layout-column' | 'sticky',
  breakpoint?: Breakpoint
): CSSResult => unsafeCSS(breakpoint ? `${breakpoint}-${type}` : type);
