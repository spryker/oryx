import { Theme } from '@spryker-oryx/experience';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const fulfillmentTheme: Theme = {
  name: 'fulfillment',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice-ng').then(
      (s) => s.backofficeNgTokens
    ),
};
