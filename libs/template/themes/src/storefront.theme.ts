import { Theme } from '@spryker-oryx/experience';
import {
  fontawesomeIcons,
  IconTypes,
  materialDesignIcons,
} from '@spryker-oryx/presets/resources';
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
        resource: fontawesomeIcons,
        types: [
          IconTypes.Profile,
          IconTypes.Customer,
          IconTypes.Sales,
          IconTypes.Users,
          IconTypes.Orders,
          IconTypes.Desktop,
          IconTypes.Mobile,
          IconTypes.Tablet,
          IconTypes.Disconnect,
          IconTypes.Video,
          IconTypes.Composition,
          IconTypes.Media,
          IconTypes.Price,
          IconTypes.Card,
          IconTypes.Top,
          IconTypes.Bottom,
          IconTypes.Filters,
          IconTypes.BulletList,
          IconTypes.ArrowsOutward,
          IconTypes.ViewList,
          IconTypes.InputStepper,
          IconTypes.Imports,
          IconTypes.Copy,
          IconTypes.File,
          IconTypes.Imports,
        ],
      },
    ],
  },
};
