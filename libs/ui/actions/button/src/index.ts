import { componentDef } from '@spryker-oryx/core';

export * from './button.component';
export * from './button.model';
export * from './button.styles';

export const buttonComponent = componentDef({
  name: 'oryx-button',
  impl: () => import('./button.component').then((m) => m.ButtonComponent),
});
