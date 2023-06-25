import { componentDef } from '@spryker-oryx/core';

export const siteTotalsItemComponent = componentDef({
  name: 'oryx-site-totals-item',
  impl: () =>
    import('./totals-item.component').then((m) => m.SiteTotalsItemComponent),
  schema: () =>
    import('./totals-item.schema').then((m) => m.siteTotalsItemSchema),
});
