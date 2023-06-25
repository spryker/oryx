import { componentDef } from '@spryker-oryx/core';

export const orderTotalsComponent = componentDef({
  name: 'oryx-site-totals',
  impl: () => import('./totals.component').then((m) => m.SiteTotalsComponent),
  schema: () => import('./totals.schema').then((m) => m.siteTotalsSchema),
});
