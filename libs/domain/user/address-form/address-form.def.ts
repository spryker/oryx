import { componentDef } from '@spryker-oryx/utilities';

export const userAddressFormComponent = componentDef({
  name: 'oryx-user-address-form',
  impl: () =>
    import('./address-form.component').then((m) => m.UserAddressFormComponent),
});
