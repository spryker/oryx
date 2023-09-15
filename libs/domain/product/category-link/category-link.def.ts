import { componentDef } from '@spryker-oryx/utilities';
import { ProductCategoryLinkOptions } from './category-link.model';

declare global {
  interface FeatureOptions {
    'oryx-product-category-link'?: ProductCategoryLinkOptions;
  }
}

export const productCategoryLinkComponent = componentDef({
  name: 'oryx-product-category-link',
  impl: () =>
    import('./category-link.component').then(
      (m) => m.ProductCategoryLinkComponent
    ),
  schema: () =>
    import('./category-link.schema').then((m) => m.productCategoryLinkSchema),
});
