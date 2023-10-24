import { componentDef } from '@spryker-oryx/utilities';

export const timeComponent = componentDef({
  name: 'oryx-time',
  impl: () => import('./time.component').then((m) => m.TimeComponent),
});
