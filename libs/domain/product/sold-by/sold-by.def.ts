import { componentDef } from '@spryker-oryx/utilities';

export const merchantSoldByComponent = componentDef({
  name: 'oryx-merchant-sold-by',
  impl: () =>
    import('./sold-by.component').then((m) => m.ProductSoldByComponent),
  schema: () => import('./sold-by.schema').then((m) => m.productSoldBySchema),
});
