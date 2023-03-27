import { componentDef } from '@spryker-oryx/core';
import { CartSummaryOptions } from './summary.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-summary'?: CartSummaryOptions;
  }
}

export const cartSummaryComponent = componentDef({
  name: 'oryx-cart-summary',
  impl: () => import('./summary.component').then((m) => m.CartSummaryComponent),
  schema: () =>
    import('./summary.schema').then((m) => m.cartSummaryComponentSchema),
  stylesheets: [
    {
      rules: () =>
        import('./summary.styles').then((m) => m.cartSummaryScreenStyles),
    },
  ],
});
