import { Theme } from '@spryker-oryx/core';
import { defaultBreakpoints } from '@spryker-oryx/theme/breakpoints';
import { backofficeIcons } from '@spryker-oryx/theme/icons';

export const backofficeTheme: Theme = {
  breakpoints: defaultBreakpoints,
  icons: backofficeIcons,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
};
