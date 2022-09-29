export const uiBackofficeTheme = {
  'oryx-button': () =>
    import('../actions/button/src/styles/themes/backoffice.styles').then(
      (b) => b.theme
    ),
  'oryx-collapsible': () =>
    import('../collapsible/src/styles/themes/backoffice.styles').then(
      (b) => b.collapsibleBackofficeUI
    ),
};
