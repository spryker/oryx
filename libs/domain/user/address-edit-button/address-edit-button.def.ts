import { componentDef } from '@spryker-oryx/core';

export const userAddressEditButtonComponent = componentDef({
  name: 'oryx-user-address-edit-button',
  impl: () =>
    import('./address-edit-button.component').then(
      (m) => m.UserAddressEditButtonComponent
    ),
  schema: () =>
    import('./address-edit-button.schema').then(
      (m) => m.userAddressEditTriggerSchema
    ),
});
