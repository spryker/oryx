import { ColorId } from '@spryker-oryx/utilities';

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

export type Color = {
  [mode in ColorId]?: {
    [tone in ColorTone]?: string;
  };
};

export type ColorPalette = Record<string, Color>;
