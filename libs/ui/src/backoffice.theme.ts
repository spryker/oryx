import { Theme } from '@spryker-oryx/core';

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
  icons: {
    cart: () => import('./cart').then((s) => s.default),
  },
};
