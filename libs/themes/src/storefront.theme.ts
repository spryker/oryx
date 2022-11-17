import { Theme } from '@spryker-oryx/core';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import { storefrontIcons } from '@spryker-oryx/themes/icons';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  icons: storefrontIcons,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
};
