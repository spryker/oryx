import { Theme } from '@spryker-oryx/experience';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import {
  fontAwesomeIcons,
  IconTypes,
  materialIcons,
} from '@spryker-oryx/themes/icons';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
  icons: {
    resource: materialIcons,
    resources: [
      {
        resource: fontAwesomeIcons,
        types: [IconTypes.User],
      },
    ],
  },
};
