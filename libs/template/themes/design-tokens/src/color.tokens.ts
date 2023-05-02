import { ColorDesignTokens, colorPalette } from '@spryker-oryx/experience';

export const color: ColorDesignTokens = {
  neutral: {
    light: {
      ...colorPalette.grays.gray.light,
      100: `var(--oryx-color-neutral-7)`,
      200: `var(--oryx-color-neutral-8)`,
      300: `var(--oryx-color-neutral-9)`,
      400: `var(--oryx-color-neutral-11)`,
      500: `var(--oryx-color-neutral-12)`,
    },
    dark: {
      ...colorPalette.grays.gray.dark,
      100: `var(--oryx-color-spryker-12)`,
      200: `var(--oryx-color-spryker-11)`,
      300: `var(--oryx-color-spryker-9)`,
      400: `var(--oryx-color-spryker-8)`,
      500: `var(--oryx-color-spryker-7)`,
    },
  },

  canvas: {
    light: {
      100: `var(--oryx-color-neutral-0)`,
      200: `var(--oryx-color-neutral-3)`,
      300: `var(--oryx-color-neutral-5)`,
      400: `var(--oryx-color-neutral-6)`,
      500: `var(--oryx-color-neutral-7)`,
    },
    dark: {
      100: `var(--oryx-color-neutral-7)`,
      200: `var(--oryx-color-neutral-6)`,
      300: `var(--oryx-color-neutral-5)`,
      400: `var(--oryx-color-neutral-4)`,
      500: `var(--oryx-color-neutral-0)`,
    },
  },

  primary: {
    light: {
      ...colorPalette.colors.spryker.light,
      100: `var(--oryx-color-primary-1)`,
      200: `var(--oryx-color-primary-7)`,
      300: `var(--oryx-color-primary-9)`,
      400: `var(--oryx-color-primary-11)`,
      500: `var(--oryx-color-primary-12)`,
    },
    dark: {
      ...colorPalette.colors.spryker.dark,
      100: `var(--oryx-color-primary-12)`,
      200: `var(--oryx-color-primary-11)`,
      300: `var(--oryx-color-primary-9)`,
      400: `var(--oryx-color-primary-7)`,
      500: `var(--oryx-color-primary-1)`,
    },
  },
  secondary: {
    light: {
      ...colorPalette.brightColors.amber.light,
      100: `var(--oryx-color-secondary-2)`,
      200: `var(--oryx-color-secondary-6)`,
      300: `var(--oryx-color-secondary-9)`,
      400: `var(--oryx-color-secondary-10)`,
      500: `var(--oryx-color-secondary-11)`,
    },
    dark: {
      ...colorPalette.brightColors.amber.dark,
      100: `var(--oryx-color-secondary-11)`,
      200: `var(--oryx-color-secondary-10)`,
      300: `var(--oryx-color-secondary-9)`,
      400: `var(--oryx-color-secondary-6)`,
      500: `var(--oryx-color-secondary-2)`,
    },
  },

  highlight: {
    light: {
      ...colorPalette.colors.red.light,
      100: `var(--oryx-color-highlight-3)`,
      200: `var(--oryx-color-highlight-7)`,
      300: `var(--oryx-color-highlight-9)`,
      400: `var(--oryx-color-highlight-10)`,
      500: `var(--oryx-color-highlight-11)`,
    },
    dark: {
      ...colorPalette.colors.red.dark,
      100: `var(--oryx-color-highlight-11)`,
      200: `var(--oryx-color-highlight-10)`,
      300: `var(--oryx-color-highlight-9)`,
      400: `var(--oryx-color-highlight-7)`,
      500: `var(--oryx-color-highlight-3)`,
    },
  },

  success: {
    light: {
      ...colorPalette.colors.spryker.light,
      100: `var(--oryx-color-success-1)`,
      200: `var(--oryx-color-success-7)`,
      300: `var(--oryx-color-success-9)`,
      400: `var(--oryx-color-success-11)`,
      500: `var(--oryx-color-success-12)`,
    },
    dark: {
      ...colorPalette.colors.spryker.dark,
      100: `var(--oryx-color-success-12)`,
      200: `var(--oryx-color-success-11)`,
      300: `var(--oryx-color-success-9)`,
      400: `var(--oryx-color-success-7)`,
      500: `var(--oryx-color-success-1)`,
    },
  },
  warning: {
    light: {
      ...colorPalette.brightColors.amber.light,
      100: `var(--oryx-color-warning-2)`,
      200: `var(--oryx-color-warning-6)`,
      300: `var(--oryx-color-warning-9)`,
      400: `var(--oryx-color-warning-10)`,
      500: `var(--oryx-color-warning-11)`,
    },
    dark: {
      ...colorPalette.brightColors.amber.dark,
      100: `var(--oryx-color-warning-11)`,
      200: `var(--oryx-color-warning-10)`,
      300: `var(--oryx-color-warning-9)`,
      400: `var(--oryx-color-warning-6)`,
      500: `var(--oryx-color-warning-2)`,
    },
  },
  error: {
    light: {
      ...colorPalette.colors.red.light,
      100: `var(--oryx-color-error-3)`,
      200: `var(--oryx-color-error-7)`,
      300: `var(--oryx-color-error-9)`,
      400: `var(--oryx-color-error-10)`,
      500: `var(--oryx-color-error-11)`,
    },
    dark: {
      ...colorPalette.colors.red.dark,
      100: `var(--oryx-color-error-11)`,
      200: `var(--oryx-color-error-10)`,
      300: `var(--oryx-color-error-9)`,
      400: `var(--oryx-color-error-7)`,
      500: `var(--oryx-color-error-3)`,
    },
  },
  info: {
    light: {
      ...colorPalette.colors.blue.light,
      100: `var(--oryx-color-info-3)`,
      200: `var(--oryx-color-info-7)`,
      300: `var(--oryx-color-info-9)`,
      400: `var(--oryx-color-info-11)`,
      500: `var(--oryx-color-info-12)`,
    },
    dark: {
      ...colorPalette.colors.blue.dark,
      100: `var(--oryx-color-info-12)`,
      200: `var(--oryx-color-info-11)`,
      300: `var(--oryx-color-info-9)`,
      400: `var(--oryx-color-info-7)`,
      500: `var(--oryx-color-info-3)`,
    },
  },

  overlay: colorPalette.overlays.black,

  ink: `var(--oryx-color-neutral-12)`,
  focus: `var(--oryx-color-spryker-9)`,
  placeholder: `var(--oryx-color-neutral-11)`,
  elevation: `var(--oryx-color-overlay-7)`,
  'elevation-2': `var(--oryx-color-overlay-3)`,
};
