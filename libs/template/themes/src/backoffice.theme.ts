import { Theme } from '@spryker-oryx/experience';
import {
  fontawesomeIcons,
  IconTypes,
  materialDesignIcons,
} from '@spryker-oryx/presets/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const backofficeTheme: Theme = {
  name: 'backoffice',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
  icons: {
    resource: fontawesomeIcons,
    resources: [
      {
        resource: materialDesignIcons,
        types: [
          IconTypes.Report,
          IconTypes.Refresh,
          IconTypes.Location,
          IconTypes.Carrier,
          IconTypes.Printer,
        ],
      },
    ],
  },
};
