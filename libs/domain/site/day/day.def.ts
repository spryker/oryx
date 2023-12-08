import { componentDef } from '@spryker-oryx/utilities';

export const siteDayComponent = componentDef({
  name: 'oryx-day',
  impl: () => import('./day.component').then((m) => m.SiteDayComponent),
  schema: import('./day.schema').then((m) => m.siteDaySchema),
});
