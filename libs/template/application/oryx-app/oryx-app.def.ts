import { componentDef } from '@spryker-oryx/utilities';

export const oryxAppComponent = componentDef({
  name: 'oryx-app',
  impl: () => import('./oryx-app.component').then((m) => m.OryxAppComponent),
});
