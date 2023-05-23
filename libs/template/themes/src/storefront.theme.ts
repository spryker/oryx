import { Theme } from '@spryker-oryx/experience';
import { materialDesignIcons } from '@spryker-oryx/presets/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
  icons: {
    resource: materialDesignIcons,
  },
};
