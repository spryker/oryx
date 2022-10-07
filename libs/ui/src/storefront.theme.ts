import { Theme } from '@spryker-oryx/core';
import { theme } from '../actions/button/src/styles/themes/storefront.styles';
import { default as cart } from './cart';

export const uiStorefrontTheme: Theme = {
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
    cart,
  },
};
