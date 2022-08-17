import { componentDef } from '@spryker-oryx/core';

export const checkboxComponent = componentDef({
  name: 'oryx-checkbox',
  impl: () => import('./checkbox.component').then((m) => m.CheckboxComponent),
});
