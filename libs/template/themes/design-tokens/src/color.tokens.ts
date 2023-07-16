import { ColorDesignTokens, colorPalette } from '@spryker-oryx/experience';

export const color: ColorDesignTokens = {
  neutral: colorPalette.grays.sprykerSfGray,
  primary: colorPalette.colors.red,
  secondary: colorPalette.colors.amber,

  highlight: colorPalette.colors.red,
  success: colorPalette.colors.spryker,
  warning: colorPalette.colors.amber,
  error: colorPalette.colors.red,
  info: colorPalette.colors.blue,

  focus: 'var(--oryx-color-primary-9)',
  placeholder: `var(--oryx-color-neutral-11)`,

  overlay: colorPalette.overlays.black,
  elevation: `var(--oryx-color-overlay-7)`,
  'elevation-2': `var(--oryx-color-overlay-3)`,
};
