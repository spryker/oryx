import { componentDef } from '@spryker-oryx/core';

export const addressFormComponent = componentDef({
  name: 'oryx-address-form',
  impl: () =>
    import('./address-form.component').then((m) => m.AddressFormComponent),
});
