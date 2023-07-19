import { componentDef } from '@spryker-oryx/utilities';
import { ProductCardOptions } from './card.model';

declare global {
  interface FeatureOptions {
    'oryx-product-card'?: ProductCardOptions;
  }
}

export const productCardComponent = componentDef({
  name: 'oryx-product-card',
  impl: () => import('./card.component').then((m) => m.ProductCardComponent),
  schema: () =>
    import('./card.schema').then((m) => m.productCardComponentSchema),
});
