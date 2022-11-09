import { Theme } from '@spryker-oryx/core';
import { defaultBreakpoints } from '@spryker-oryx/theme/breakpoints';
import { backofficeNgIcons } from '@spryker-oryx/theme/icons';

export const backofficeNgTheme: Theme = {
  name: 'backoffice-ng',
  breakpoints: defaultBreakpoints,
  icons: backofficeNgIcons,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
};
