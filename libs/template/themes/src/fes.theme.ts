import { Theme } from '@spryker-oryx/experience';
import { materialDesignIcons } from '@spryker-oryx/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

/**
 * @deprecated since version 1.1 use backofficeTheme instead
 * */
export const fesTheme: Theme = {
  name: 'fes',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
  icons: {
    resource: materialDesignIcons,
  },
};
