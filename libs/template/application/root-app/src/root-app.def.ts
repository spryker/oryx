import { componentDef } from '@spryker-oryx/core';

export const rootAppComponent = componentDef({
  name: 'root-app',
  impl: () => import('./root-app.component').then((m) => m.RootAppComponent),
});
