import { Theme } from '@spryker-oryx/experience';
import { backofficeNgIcons } from '@spryker-oryx/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

/**
 * @deprecated since version 1.2 use backofficeTheme or fulfillmentTheme instead
 * */
export const backofficeNgTheme: Theme = {
  name: 'backoffice-ng',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
  icons: {
    resource: backofficeNgIcons,
  },
};
