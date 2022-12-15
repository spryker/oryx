import { componentDef } from '@spryker-oryx/core';

export const manageAddressComponent = componentDef({
  name: 'oryx-checkout-manage-address',
  impl: () =>
    import('./manage-address.component').then((m) => m.ManageAddressComponent),
});
