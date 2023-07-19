import { componentDef } from '@spryker-oryx/utilities';

export const orderEntriesComponent = componentDef({
  name: 'oryx-order-entries',
  impl: () =>
    import('./entries.component').then((m) => m.OrderEntriesComponent),
  schema: () => import('./entries.schema').then((m) => m.orderEntriesSchema),
});
