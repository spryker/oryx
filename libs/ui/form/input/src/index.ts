import { componentDef } from '@spryker-oryx/core';

export * from './affix';
export * from './error';
export * from './form-control';
export * from './input.component';

export const inputComponent = componentDef({
  name: 'oryx-input',
  impl: () => import('./input.component').then((m) => m.InputComponent),
});
