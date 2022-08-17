import { componentDef } from '@spryker-oryx/core';

export const inputComponent = componentDef({
  name: 'oryx-input',
  impl: () => import('./input.component').then((m) => m.InputComponent),
});
