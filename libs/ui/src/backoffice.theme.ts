import { Theme } from '@spryker-oryx/core';
import { backofficeIcons } from '@spryker-oryx/theme/icons';

export const uiBackofficeTheme: Theme = {
  breakpoints: {
    md: {
      min: 768,
    },
    lg: {
      min: 1024,
    },
  },
  components: {
    'oryx-button': () =>
      import('../actions/button/src/styles/themes/backoffice.styles').then(
        (b) => b.theme
      ),
    'oryx-collapsible': () =>
      import('../collapsible/src/styles/themes/backoffice.styles').then(
        (b) => b.collapsibleBackofficeUI
      ),
    'oryx-chip': () =>
      import('../graphical/chip/src/styles/themes/backoffice.styles').then(
        (b) => b.chipBackofficeUI
      ),
  },
  icons: backofficeIcons,
};
