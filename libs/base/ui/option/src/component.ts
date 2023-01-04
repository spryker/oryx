import { componentDef } from '@spryker-oryx/core';

export const optionComponent = componentDef({
  name: 'oryx-option',
  impl: () => import('./option.component').then((m) => m.OptionComponent),
});
