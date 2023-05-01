export const enum ColorTone {
  Canvas,
  Background,
  BackgroundSubtle,
  ElementBackground,
  ElementHover,
  ElementActive,
  Separator,
  Border,
  BorderHover,
  Solid,
  SolidHOver,
  LowContrast,
  HighContrast,
}

export const enum TempColorMode {
  Light = 'light',
  Dark = 'dark',
}

export type Color = {
  [mode in TempColorMode]?: {
    [tone in ColorTone]?: string;
  };
};

export type ColorPalette = Record<string, Color>;
