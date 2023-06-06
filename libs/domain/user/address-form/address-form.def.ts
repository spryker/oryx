import { componentDef } from '@spryker-oryx/core';

export const addressFormComponent = componentDef({
  name: 'oryx-user-address-form',
  impl: () =>
    import('./address-form.component').then((m) => m.UserAddressFormComponent),
});
