import { componentDef } from '@spryker-oryx/utilities';
import { ProductLabelsOptions } from './label.model';

declare global {
  interface FeatureOptions {
    'oryx-product-labels'?: ProductLabelsOptions;
  }
}

export const productLabelsComponent = componentDef({
  name: 'oryx-product-labels',
  impl: () => import('./label.component').then((m) => m.ProductLabelsComponent),
  schema: () => import('./label.schema').then((m) => m.productLabelSchema),
});
