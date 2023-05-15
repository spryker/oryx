import { Theme } from '@spryker-oryx/experience';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { fontAwesomeMapper, materialMapper } from '../icons';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
  icons: {
    resource: materialMapper,
    resources: [
      {
        resource: fontAwesomeMapper,
        types: [IconTypes.User],
      },
    ],
  },
};
