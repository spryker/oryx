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
      ...colorPalette.colors.green.light,
      100: `var(--oryx-color-spryker-1)`,
      200: `var(--oryx-color-spryker-7)`,
      300: `var(--oryx-color-spryker-9)`,
      400: `var(--oryx-color-spryker-11)`,
      500: `var(--oryx-color-spryker-12)`,
    },
    dark: {
      ...colorPalette.colors.green.dark,
      100: `var(--oryx-color-spryker-12)`,
      200: `var(--oryx-color-spryker-11)`,
      300: `var(--oryx-color-spryker-9)`,
      400: `var(--oryx-color-spryker-7)`,
      500: `var(--oryx-color-spryker-1)`,
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
      100: `var(--oryx-color-red-3)`,
      200: `var(--oryx-color-red-7)`,
      300: `var(--oryx-color-red-9)`,
      400: `var(--oryx-color-red-10)`,
      500: `var(--oryx-color-red-11)`,
    },
    dark: {
      ...colorPalette.colors.red.dark,
      100: `var(--oryx-color-red-11)`,
      200: `var(--oryx-color-red-10)`,
      300: `var(--oryx-color-red-9)`,
      400: `var(--oryx-color-red-7)`,
      500: `var(--oryx-color-red-3)`,
    },
  },

  success: {
    light: {
      ...colorPalette.colors.green.light,
      100: `var(--oryx-color-spryker-1)`,
      200: `var(--oryx-color-spryker-7)`,
      300: `var(--oryx-color-spryker-9)`,
      400: `var(--oryx-color-spryker-11)`,
      500: `var(--oryx-color-spryker-12)`,
    },
    dark: {
      ...colorPalette.colors.green.dark,
      100: `var(--oryx-color-spryker-12)`,
      200: `var(--oryx-color-spryker-11)`,
      300: `var(--oryx-color-spryker-9)`,
      400: `var(--oryx-color-spryker-7)`,
      500: `var(--oryx-color-spryker-1)`,
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

  spryker: colorPalette.colors.spryker,
  overlay: colorPalette.overlays.black,

  ink: `var(--oryx-color-neutral-12)`,
  focus: `var(--oryx-color-spryker-9)`,
  placeholder: `var(--oryx-color-neutral-11)`,
  'elevation-color': `var(--oryx-color-overlay-2)`,
  'elevation-color-2': `var(--oryx-color-overlay-2)`,
};
