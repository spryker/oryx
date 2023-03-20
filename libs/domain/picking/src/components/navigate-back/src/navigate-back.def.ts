import { componentDef } from '@spryker-oryx/core';
// import { CartAddOptions } from './confirm-picking.model';

// declare global {
//   interface FeatureOptions {
//     'oryx-cart-add'?: CartAddOptions;
//   }
// }

export const navigateBackComponent = componentDef({
  name: 'oryx-navigate-back',
  impl: () => import('./navigate-back.component').then((m) => m.NavigateBackComponent),
});
