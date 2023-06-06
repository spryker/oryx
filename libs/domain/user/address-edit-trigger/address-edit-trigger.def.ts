import { componentDef } from '@spryker-oryx/core';

export const userAddressEditTriggerComponent = componentDef({
  name: 'oryx-user-address-edit-trigger',
  impl: () =>
    import('./address-edit-trigger.component').then(
      (m) => m.UserAddressEditTriggerComponent
    ),
  schema: () =>
    import('./address-edit-trigger.schema').then(
      (m) => m.userAddressEditTriggerSchema
    ),
});
