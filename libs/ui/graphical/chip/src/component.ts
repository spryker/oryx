import { componentDef } from '@spryker-oryx/core';

export const chipComponent = componentDef({
  name: 'oryx-chip',
  impl: () => import('./chip.component').then((m) => m.ChipComponent),
});
