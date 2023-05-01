import { Theme } from '@spryker-oryx/experience';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import { backofficeIcons } from '@spryker-oryx/themes/icons';

export const backofficeTheme: Theme = {
  name: 'backoffice',
  breakpoints: defaultBreakpoints,
  icons: backofficeIcons,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
};
