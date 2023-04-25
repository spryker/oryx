import { ColorMode, ColorTone } from '@spryker-oryx/core';

export interface ColorPaletteAttributes {
  mode?: ColorMode;
  tone?: ColorTone;
  color?: string;
  layout?: 'list' | 'grid';
}
