import { componentDef } from '@spryker-oryx/core';

export const userAddressAddButtonComponent = componentDef({
  name: 'oryx-user-address-add-button',
  impl: () =>
    import('./address-add-button.component').then(
      (m) => m.UserAddressAddButtonComponent
    ),
  schema: () =>
    import('./address-add-button.schema').then(
      (m) => m.userAddressAddButtonSchema
    ),
});
