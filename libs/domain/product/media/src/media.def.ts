import { componentDef } from '@spryker-oryx/utilities';
import { ProductMediaOptions } from './media.model';

declare global {
  interface FeatureOptions {
    'oryx-product-media'?: ProductMediaOptions;
  }
}

export const productMediaComponent = componentDef({
  name: 'oryx-product-media',
  impl: () => import('./media.component').then((m) => m.ProductMediaComponent),
  schema: () => import('./media.schema').then((m) => m.productMediaSchema),
});
