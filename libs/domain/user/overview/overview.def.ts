import { componentDef } from '@spryker-oryx/utilities';

export const overviewComponent = componentDef({
  name: 'oryx-user-overview',
  impl: () => import('./overview.component').then((m) => m.OverviewComponent),
});
