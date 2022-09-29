import { theme } from '../actions/button/src/styles/themes/storefront.styles';

export const uiStorefrontTheme = {
  'oryx-button': theme,
  'oryx-icon-button': () =>
    import('../actions/icon-button/src/styles/themes/storefront.styles').then(
      (t) => t.iconButtonStorefrontUI
    ),
  'oryx-collapsible': () =>
    import('../collapsible/src/styles/themes/storefront.styles').then(
      (b) => b.collapsibleStorefrontUI
    ),
};
