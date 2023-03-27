import { componentDef } from '@spryker-oryx/core';

export const pickingComponent = componentDef({
  name: 'oryx-picking',
  impl: () => import('./picking.component').then((m) => m.default),
});
