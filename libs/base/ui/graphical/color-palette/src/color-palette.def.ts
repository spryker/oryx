import { componentDef } from '@spryker-oryx/core';

export const colorPaletteComponent = componentDef({
  name: 'oryx-color-palette',
  impl: () =>
    import('./color-palette.component').then((m) => m.ColorPaletteComponent),
});
