import { componentDef } from '@spryker-oryx/core';

export * from './checkbox.component';
export * from './checkbox.model';
export * from './checkbox.styles';

export const checkboxComponent = componentDef({
  name: 'oryx-checkbox',
  impl: () => import('./checkbox.component').then((m) => m.CheckboxComponent),
});
