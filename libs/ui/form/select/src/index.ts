import { componentDef } from '@spryker-oryx/core';

export * from './controllers';
export * from './select.component';
export * from './select.model';
export * from './styles';

export const selectComponent = componentDef({
  name: 'oryx-select',
  impl: () => import('./select.component').then((m) => m.SelectComponent),
});
