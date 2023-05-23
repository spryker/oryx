import { Theme } from '@spryker-oryx/experience';
import { materialDesignIcons } from '@spryker-oryx/presets/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const fesTheme: Theme = {
  name: 'fes',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
  icons: {
    resource: materialDesignIcons,
  },
};
