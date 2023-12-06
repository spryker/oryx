import { componentDef } from '@spryker-oryx/utilities';
import { ProductCategoryListOptions } from './list.model';

declare global {
  interface FeatureOptions {
    'oryx-product-category-list'?: ProductCategoryListOptions;
  }
}

export const productCategoryListComponent = componentDef({
  name: 'oryx-product-category-list',
  impl: () =>
    import('./list.component').then((m) => m.ProductCategoryListComponent),
  schema: () =>
    import('./list.schema').then((m) => m.productCategoryListSchema),
});
