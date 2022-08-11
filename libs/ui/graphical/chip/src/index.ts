import { componentDef } from '@spryker-oryx/core';

export * from './chip.component';
export * from './chip.model';
export * from './chip.styles';

export const chipComponent = componentDef({
  name: 'oryx-chip',
  impl: () => import('./chip.component').then((m) => m.ChipComponent),
});
