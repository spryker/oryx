import { componentDef } from '@spryker-oryx/utilities';

export const merchantContactComponent = componentDef({
  name: 'oryx-merchant-contact',
  impl: () =>
    import('./contact.component').then((m) => m.MerchantContactComponent),
});
