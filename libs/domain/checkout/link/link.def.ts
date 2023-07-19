import { componentDef } from '@spryker-oryx/utilities';
import { checkoutLinkScreenStyles } from './link.styles';

export const checkoutLinkComponent = componentDef({
  name: 'oryx-checkout-link',
  impl: () => import('./link.component').then((m) => m.CheckoutLinkComponent),
  stylesheets: [{ rules: checkoutLinkScreenStyles }],
  schema: () =>
    import('./link.schema').then((m) => m.checkoutLinkComponentSchema),
});
