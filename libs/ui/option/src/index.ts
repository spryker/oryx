import { componentDef } from '@spryker-oryx/core';

export * from './option.component';
export * from './option.styles';

export const optionComponent = componentDef({
  name: 'oryx-option',
  impl: () => import('./option.component').then((m) => m.OptionComponent),
});
