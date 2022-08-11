import { componentDef } from '@spryker-oryx/core';

export * from './toggle.component';
export * from './toggle.styles';

export const toggleComponent = componentDef({
  name: 'oryx-toggle',
  impl: () => import('./toggle.component').then((m) => m.ToggleComponent),
});
