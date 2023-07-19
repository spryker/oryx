import { componentDef } from '@spryker-oryx/utilities';

export const toggleComponent = componentDef({
  name: 'oryx-toggle',
  impl: () => import('./toggle.component').then((m) => m.ToggleComponent),
});
