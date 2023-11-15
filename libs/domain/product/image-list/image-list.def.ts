import { componentDef } from '@spryker-oryx/utilities';

export const productImageListComponent = componentDef({
  name: 'oryx-product-image-list',
  impl: () =>
    import('./image-list.component').then((m) => m.ProductImageListComponent),
});
