import { componentDef } from '@spryker-oryx/core';

export const addressAddTriggerComponent = componentDef({
  name: 'oryx-user-address-add-trigger',
  impl: () =>
    import('./address-add-trigger.component').then(
      (m) => m.UserAddressAddTriggerComponent
    ),
  schema: () =>
    import('./address-add-trigger.schema').then(
      (m) => m.userAddressAddTriggerSchema
    ),
});
