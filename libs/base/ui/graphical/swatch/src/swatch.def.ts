import { componentDef } from '@spryker-oryx/core';

export const swatchComponent = componentDef({
  name: 'oryx-swatch',
  impl: () => import('./swatch.component').then((m) => m.SwatchComponent),
});
