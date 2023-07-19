import { componentDef } from '@spryker-oryx/utilities';
import { ProductPriceOptions } from './price.model';

declare global {
  interface FeatureOptions {
    'oryx-product-price'?: ProductPriceOptions;
  }
}

export const productPriceComponent = componentDef({
  name: 'oryx-product-price',
  impl: () => import('./price.component').then((m) => m.ProductPriceComponent),
  schema: () => import('./price.schema').then((m) => m.productPriceSchema),
});
