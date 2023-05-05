import { ColorDesignTokens, colorPalette } from '@spryker-oryx/experience';

export const color: ColorDesignTokens = {
  neutralA: colorPalette.grays.gray,
  primaryA: colorPalette.colors.spryker,
  secondaryA: colorPalette.colors.amber,
  highlightA: colorPalette.colors.red,
  successA: colorPalette.colors.spryker,
  warningA: colorPalette.colors.amber,
  errorA: colorPalette.colors.red,
  infoA: colorPalette.colors.blue,
  overlay: colorPalette.overlays.black,

  neutral: {
    light: {
      100: `var(--oryx-color-neutralA-7)`,
      200: `var(--oryx-color-neutralA-8)`,
      300: `var(--oryx-color-neutralA-9)`,
      400: `var(--oryx-color-neutralA-11)`,
      500: `var(--oryx-color-neutralA-12)`,
    },
    dark: {
      100: `var(--oryx-color-neutralA-12)`,
      200: `var(--oryx-color-neutralA-11)`,
      300: `var(--oryx-color-neutralA-9)`,
      400: `var(--oryx-color-neutralA-8)`,
      500: `var(--oryx-color-neutralA-7)`,
    },
  },
  canvas: {
    light: {
      100: `var(--oryx-color-neutralA-0)`,
      200: `var(--oryx-color-neutralA-3)`,
      300: `var(--oryx-color-neutralA-5)`,
      400: `var(--oryx-color-neutralA-6)`,
      500: `var(--oryx-color-neutralA-7)`,
    },
    dark: {
      100: `var(--oryx-color-neutralA-7)`,
      200: `var(--oryx-color-neutralA-6)`,
      300: `var(--oryx-color-neutralA-5)`,
      400: `var(--oryx-color-neutralA-4)`,
      500: `var(--oryx-color-neutralA-0)`,
    },
  },
  primary: {
    light: {
      100: `var(--oryx-color-primaryA-1)`,
      200: `var(--oryx-color-primaryA-7)`,
      300: `var(--oryx-color-primaryA-9)`,
      400: `var(--oryx-color-primaryA-11)`,
      500: `var(--oryx-color-primaryA-12)`,
    },
    dark: {
      100: `var(--oryx-color-primaryA-12)`,
      200: `var(--oryx-color-primaryA-11)`,
      300: `var(--oryx-color-primaryA-9)`,
      400: `var(--oryx-color-primaryA-7)`,
      500: `var(--oryx-color-primaryA-1)`,
    },
  },
  secondary: {
    light: {
      100: `var(--oryx-color-secondaryA-2)`,
      200: `var(--oryx-color-secondaryA-6)`,
      300: `var(--oryx-color-secondaryA-9)`,
      400: `var(--oryx-color-secondaryA-10)`,
      500: `var(--oryx-color-secondaryA-11)`,
    },
    dark: {
      100: `var(--oryx-color-secondaryA-11)`,
      200: `var(--oryx-color-secondaryA-10)`,
      300: `var(--oryx-color-secondaryA-9)`,
      400: `var(--oryx-color-secondaryA-6)`,
      500: `var(--oryx-color-secondaryA-2)`,
    },
  },
  highlight: {
    light: {
      100: `var(--oryx-color-highlightA-3)`,
      200: `var(--oryx-color-highlightA-7)`,
      300: `var(--oryx-color-highlightA-9)`,
      400: `var(--oryx-color-highlightA-10)`,
      500: `var(--oryx-color-highlightA-11)`,
    },
    dark: {
      100: `var(--oryx-color-highlightA-11)`,
      200: `var(--oryx-color-highlightA-10)`,
      300: `var(--oryx-color-highlightA-9)`,
      400: `var(--oryx-color-highlightA-7)`,
      500: `var(--oryx-color-highlightA-3)`,
    },
  },
  success: {
    light: {
      100: `var(--oryx-color-successA-1)`,
      200: `var(--oryx-color-successA-7)`,
      300: `var(--oryx-color-successA-9)`,
      400: `var(--oryx-color-successA-11)`,
      500: `var(--oryx-color-successA-12)`,
    },
    dark: {
      100: `var(--oryx-color-successA-12)`,
      200: `var(--oryx-color-successA-11)`,
      300: `var(--oryx-color-successA-9)`,
      400: `var(--oryx-color-successA-7)`,
      500: `var(--oryx-color-successA-1)`,
    },
  },
  warning: {
    light: {
      100: `var(--oryx-color-warningA-2)`,
      200: `var(--oryx-color-warningA-6)`,
      300: `var(--oryx-color-warningA-9)`,
      400: `var(--oryx-color-warningA-10)`,
      500: `var(--oryx-color-warningA-11)`,
    },
    dark: {
      100: `var(--oryx-color-warningA-11)`,
      200: `var(--oryx-color-warningA-10)`,
      300: `var(--oryx-color-warningA-9)`,
      400: `var(--oryx-color-warningA-6)`,
      500: `var(--oryx-color-warningA-2)`,
    },
  },
  error: {
    light: {
      100: `var(--oryx-color-errorA-3)`,
      200: `var(--oryx-color-errorA-7)`,
      300: `var(--oryx-color-errorA-9)`,
      400: `var(--oryx-color-errorA-10)`,
      500: `var(--oryx-color-errorA-11)`,
    },
    dark: {
      100: `var(--oryx-color-errorA-11)`,
      200: `var(--oryx-color-errorA-10)`,
      300: `var(--oryx-color-errorA-9)`,
      400: `var(--oryx-color-errorA-7)`,
      500: `var(--oryx-color-errorA-3)`,
    },
  },
  info: {
    light: {
      100: `var(--oryx-color-infoA-3)`,
      200: `var(--oryx-color-infoA-7)`,
      300: `var(--oryx-color-infoA-9)`,
      400: `var(--oryx-color-infoA-11)`,
      500: `var(--oryx-color-infoA-12)`,
    },
    dark: {
      100: `var(--oryx-color-infoA-12)`,
      200: `var(--oryx-color-infoA-11)`,
      300: `var(--oryx-color-infoA-9)`,
      400: `var(--oryx-color-infoA-7)`,
      500: `var(--oryx-color-infoA-3)`,
    },
  },
  ink: `var(--oryx-color-neutralA-12)`,
  focus: `var(--oryx-color-primaryA-9)`,
  placeholder: `var(--oryx-color-neutralA-11)`,
  elevation: `var(--oryx-color-overlay-7)`,
  'elevation-2': `var(--oryx-color-overlay-3)`,
};
