import { Theme } from '@spryker-oryx/experience';
import { backofficeNgIcons } from '@spryker-oryx/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const backofficeNgTheme: Theme = {
  name: 'backoffice-ng',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice-ng').then(
      (s) => s.backofficeNgTokens
    ),
  icons: {
    resource: backofficeNgIcons,
  },
};
