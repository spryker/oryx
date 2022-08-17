import { componentDef } from '@spryker-oryx/core';

export const inputListComponent = componentDef({
  name: 'oryx-input-list',
  impl: () =>
    import('./input-list.component').then((m) => m.InputListComponent),
});
