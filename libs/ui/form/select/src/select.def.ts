import { componentDef } from '@spryker-oryx/core';

export const selectComponent = componentDef({
  name: 'oryx-select',
  impl: () => import('./select.component').then((m) => m.SelectComponent),
});
