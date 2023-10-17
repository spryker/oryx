import { componentDef } from '@spryker-oryx/utilities';

export const cartHeadingComponent = componentDef({
  name: 'oryx-cart-heading',
  impl: () => import('./heading.component').then((m) => m.CartHeadingComponent),
});
