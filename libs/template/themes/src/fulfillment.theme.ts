import { Theme } from '@spryker-oryx/core';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import { fulfillmentIcons } from '@spryker-oryx/themes/icons';

export const fulfillmentTheme: Theme = {
  name: 'fulfillment',
  breakpoints: defaultBreakpoints,
  icons: fulfillmentIcons,
  designTokens: () =>
    import('../design-tokens/src/backoffice-ng').then(
      (s) => s.backofficeNgTokens
    ),
};
