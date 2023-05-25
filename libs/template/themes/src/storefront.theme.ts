import { Theme } from '@spryker-oryx/experience';
import { materialDesignIcons, storefrontIcons } from '@spryker-oryx/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
  icons: {
    resource: materialDesignIcons,
    resources: [
      {
        resource: storefrontIcons,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        types: Object.keys(storefrontIcons.mapping!),
      },
    ],
  },
};
