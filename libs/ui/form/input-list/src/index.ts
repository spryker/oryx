import { componentDef } from '@spryker-oryx/core';

export * from './input-list.component';
export * from './input-list.model';
export * from './input-list.styles';

export const inputListComponent = componentDef({
  name: 'oryx-input-list',
  impl: () =>
    import('./input-list.component').then((m) => m.InputListComponent),
});
