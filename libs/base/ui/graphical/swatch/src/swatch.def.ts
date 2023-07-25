import { componentDef } from '@spryker-oryx/utilities';

export const swatchComponent = componentDef({
  name: 'oryx-swatch',
  impl: () => import('./swatch.component').then((m) => m.SwatchComponent),
});
