import { componentDef } from '@spryker-oryx/core';
// import { CartAddOptions } from './confirm-picking.model';

// declare global {
//   interface FeatureOptions {
//     'oryx-cart-add'?: CartAddOptions;
//   }
// }

export const customerNoteComponent = componentDef({
  name: 'oryx-customer-note',
  impl: () => import('./customer-note.component').then((m) => m.CustomerNoteComponent),
});
