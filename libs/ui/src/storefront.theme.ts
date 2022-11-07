import { Theme } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { theme } from '../actions/button/src/styles/themes/storefront.styles';

export const uiStorefrontTheme: Theme = {
  breakpoints: {
    [Size.Sm]: {
      min: 0,
    },
    [Size.Md]: {
      min: 768,
    },
    [Size.Lg]: {
      min: 1024,
    },
  },
  components: {
    'oryx-button': theme,
    'oryx-icon-button': () =>
      import('../actions/icon-button/src/styles/themes/storefront.styles').then(
        (t) => t.iconButtonStorefrontUI
      ),
    'oryx-collapsible': () =>
      import('../collapsible/src/styles/themes/storefront.styles').then(
        (b) => b.collapsibleStorefrontUI
      ),
    'oryx-chip': () =>
      import('../graphical/chip/src/styles/themes/storefront.styles').then(
        (b) => b.chipStorefrontUI
      ),
  },
  icons: {
    cart: () => import('./cart').then((s) => s.default),
  },
  designTokens: () => import('./styles/design-tokens').then((s) => s.default),
  globalStyles: () => import('./styles/global.styles').then((s) => s.default),
};
