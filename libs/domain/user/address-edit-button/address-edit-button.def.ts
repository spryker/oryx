import { componentDef } from '@spryker-oryx/core';

export const userAddressEditTriggerComponent = componentDef({
  name: 'oryx-user-address-edit-trigger',
  impl: () =>
    import('./address-edit-button.component').then(
      (m) => m.UserAddressEditTriggerComponent
    ),
  schema: () =>
    import('./address-edit-button.schema').then(
      (m) => m.userAddressEditTriggerSchema
    ),
});
