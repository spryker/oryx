import { theme } from '../actions/button/src/styles/themes/storefront.styles';

export const uiStorefrontTheme = {
  'oryx-button': theme,
  'oryx-collapsible': () =>
    import('../collapsible/src/styles/themes/storefront.styles').then(
      (b) => b.composableStorefrontUI
    ),
};
