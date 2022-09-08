export const uiBackofficeTheme = {
  'oryx-button': () =>
    import('../actions/button/src/styles/themes/backoffice.styles').then(
      (b) => b.theme
    ),
};
